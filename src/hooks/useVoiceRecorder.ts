import { useRef, useState, useCallback, useEffect } from "react";

interface UseVoiceRecorderOptions {
  /** Called with the recorded blob when a speech segment ends (silence detected). */
  onAudioReady: (blob: Blob) => void;
  /** Called the moment the user starts speaking — use this to interrupt agent audio. */
  onSpeechStart?: () => void;
  /** RMS energy threshold (0–1) below which audio counts as silence. Default: 0.01 */
  silenceThreshold?: number;
  /** Ms of continuous silence before the segment is finalised. Default: 1500 */
  silenceDuration?: number;
}

/**
 * Persistent microphone with Voice-Activity Detection.
 *
 * - Mic stays open the whole meeting (startListening / stopListening).
 * - While open the hook continuously records in segments:
 *     speech detected → keep buffering
 *     silence for `silenceDuration` ms → flush segment → onAudioReady → restart recorder
 * - When the user starts speaking after silence, onSpeechStart fires so the
 *   caller can interrupt any playing agent audio.
 */
export function useVoiceRecorder({
  onAudioReady,
  onSpeechStart,
  silenceThreshold = 0.01,
  silenceDuration = 1500,
}: UseVoiceRecorderOptions) {
  const [isActive, setIsActive]   = useState(false); // mic open
  const [isSpeaking, setIsSpeaking] = useState(false); // user currently speaking

  // Refs — everything that must survive across recorder cycles
  const streamRef       = useRef<MediaStream | null>(null);
  const audioCtxRef     = useRef<AudioContext | null>(null);
  const analyserRef     = useRef<AnalyserNode | null>(null);
  const recorderRef     = useRef<MediaRecorder | null>(null);
  const chunksRef       = useRef<Blob[]>([]);
  const mimeTypeRef     = useRef("audio/webm");
  const isActiveRef     = useRef(false); // mirrors isActive for use in async callbacks
  const wasSpeakingRef  = useRef(false); // tracks last VAD state to detect transitions

  // Keep latest callbacks in refs so recorder's onstop closure never goes stale
  const onAudioReadyRef  = useRef(onAudioReady);
  const onSpeechStartRef = useRef(onSpeechStart);
  useEffect(() => { onAudioReadyRef.current = onAudioReady; },   [onAudioReady]);
  useEffect(() => { onSpeechStartRef.current = onSpeechStart; }, [onSpeechStart]);

  // ── Recorder cycle ─────────────────────────────────────────────────────────
  // Defined as a plain function stored in a ref so onstop can call it without
  // stale-closure issues.
  const startRecorderRef = useRef<() => void>(() => {});

  startRecorderRef.current = () => {
    if (!isActiveRef.current || !streamRef.current) return;

    const mimeType = mimeTypeRef.current;
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorderRef.current = recorder;
    chunksRef.current   = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    let startTime = 0;
    recorder.onstart = () => { startTime = Date.now(); };

    recorder.onstop = () => {
      const duration = Date.now() - startTime;
      const blob = new Blob(chunksRef.current, { type: mimeType });
      chunksRef.current = [];
      
      // Filter out segments shorter than 500ms (likely noise like a bark or cough)
      if (duration > 500 && blob.size > 2000) {
        onAudioReadyRef.current(blob);
      }
      
      // Immediately start the next recording segment if still listening
      startRecorderRef.current();
    };

    recorder.start(250);
  };

  // ── VAD loop ───────────────────────────────────────────────────────────────
  const startVAD = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray   = new Float32Array(analyser.fftSize);
    let silenceStart: number | null = null;

    const tick = () => {
      if (!isActiveRef.current || !analyserRef.current) return;

      analyserRef.current.getFloatTimeDomainData(dataArray);
      const rms      = Math.sqrt(dataArray.reduce((s, x) => s + x * x, 0) / dataArray.length);
      const speaking = rms >= silenceThreshold;

      if (speaking && !wasSpeakingRef.current) {
        // ── Speech just started ──────────────────────────────────────────────
        wasSpeakingRef.current = true;
        setIsSpeaking(true);
        silenceStart = null;
        onSpeechStartRef.current?.(); // interrupt agent audio
      } else if (!speaking && wasSpeakingRef.current) {
        // ── Silence just started ─────────────────────────────────────────────
        wasSpeakingRef.current = false;
        setIsSpeaking(false);
        silenceStart = Date.now();
      }

      // Flush the segment when silence is long enough
      if (!speaking && silenceStart !== null && Date.now() - silenceStart >= silenceDuration) {
        silenceStart = null;
        if (recorderRef.current?.state === "recording") {
          recorderRef.current.stop(); // onstop will restart the recorder
        }
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [silenceThreshold, silenceDuration]);

  // ── Public API ─────────────────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    if (isActiveRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current   = stream;
      isActiveRef.current = true;
      setIsActive(true);

      mimeTypeRef.current = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const ctx     = new AudioContext();
      audioCtxRef.current = ctx;
      const source  = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      startRecorderRef.current();
      startVAD();
    } catch (err) {
      console.error("[useVoiceRecorder] Microphone error:", err);
    }
  }, [startVAD]);

  const stopListening = useCallback(() => {
    isActiveRef.current      = false;
    wasSpeakingRef.current   = false;
    setIsActive(false);
    setIsSpeaking(false);

    if (recorderRef.current?.state !== "inactive") {
      recorderRef.current?.stop();
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  return { isActive, isSpeaking, startListening, stopListening };
}
