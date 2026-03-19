import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Square, Loader2 } from "lucide-react";

interface SpeechInputProps {
  onTranscript: (text: string) => void;
  onVolumeChange: (volume: number) => void;
  onListeningChange: (isListening: boolean) => void;
  isDisabled?: boolean;
}

export const SpeechInput = ({
  onTranscript,
  onVolumeChange,
  onListeningChange,
  isDisabled = false,
}: SpeechInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Audio analysis refs (kept for glow visualization)
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioAnalysis();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // ─── Audio Analysis (for Glow visualization) ───────────────────────
  const startAudioAnalysis = useCallback(
    (stream: MediaStream) => {
      try {
        const audioCtx = new AudioContext();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg =
            dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          const normalized = Math.min(avg / 128, 1);
          onVolumeChange(normalized);
          animFrameRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch (err) {
        console.error("Audio analysis error:", err);
      }
    },
    [onVolumeChange]
  );

  const stopAudioAnalysis = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    onVolumeChange(0);
  }, [onVolumeChange]);

  // ─── Transcription via Whisper API ─────────────────────────────────
  const transcribeAudio = useCallback(
    async (audioBlob: Blob) => {
      setIsTranscribing(true);
      setErrorMessage(null);

      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Transcription failed (${response.status})`
          );
        }

        const data = await response.json();

        if (data.text && data.text.trim()) {
          onTranscript(data.text.trim());
        } else {
          setErrorMessage("No speech detected. Try again.");
        }
      } catch (err: any) {
        console.error("Transcription error:", err);
        setErrorMessage(err.message || "Failed to transcribe audio.");
      } finally {
        setIsTranscribing(false);
      }
    },
    [onTranscript]
  );

  // ─── Recording Controls ────────────────────────────────────────────
  const startListening = useCallback(async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Determine best supported MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });
        // Only transcribe if we have meaningful audio data
        if (audioBlob.size > 0) {
          transcribeAudio(audioBlob);
        }
      };

      // Collect data in 250ms chunks for reliability
      mediaRecorder.start(250);

      setIsListening(true);
      onListeningChange(true);

      // Start audio analysis for the glow visualization
      startAudioAnalysis(stream);
    } catch (err: any) {
      console.error("Microphone access denied:", err);
      setErrorMessage("Microphone access denied. Please allow mic access.");
    }
  }, [onListeningChange, startAudioAnalysis, transcribeAudio]);

  const stopListening = useCallback(() => {
    // Stop the MediaRecorder – this triggers onstop → transcribeAudio
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    setIsListening(false);
    onListeningChange(false);
    stopAudioAnalysis();
  }, [onListeningChange, stopAudioAnalysis]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onTranscript(textInput.trim());
      setTextInput("");
    }
  };

  const isBusy = isDisabled || isTranscribing;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      {/* Transcribing status */}
      <AnimatePresence>
        {isTranscribing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass px-4 py-2 rounded-xl text-sm text-cyan-300/80 italic text-center max-w-xs flex items-center gap-2"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Transcribing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {errorMessage && !isTranscribing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass px-4 py-2 rounded-xl text-sm text-red-400/80 text-center max-w-xs"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Row */}
      <div className="flex items-center gap-3">
        {/* Mic Button */}
        <motion.button
          onClick={toggleListening}
          disabled={isBusy}
          className={`relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300 ${
            isListening
              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_30px_rgba(0,200,255,0.3)]"
              : "bg-white/5 border-white/10 text-white/70 hover:border-[#7F0DF2]/50 hover:bg-[#7F0DF2]/10 hover:text-[#7F0DF2]"
          } ${isBusy ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
        >
          {isTranscribing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isListening ? (
            <Square className="w-5 h-5 fill-current" />
          ) : (
            <Mic className="w-6 h-6" />
          )}

          {/* Pulse rings when listening */}
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
                animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}
        </motion.button>
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
        {isTranscribing
          ? "Processing your voice..."
          : isListening
          ? "Tap to stop · Speak your vision"
          : "Tap to speak · Or type below"}
      </p>

      {/* Text fallback input */}
      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTextSubmit();
          }}
          placeholder="Type a message..."
          disabled={isBusy}
          className="flex-1 h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7F0DF2]/40 transition-colors disabled:opacity-40"
        />
        <motion.button
          onClick={handleTextSubmit}
          disabled={isBusy || !textInput.trim()}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#7F0DF2] text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          whileTap={{ scale: 0.9 }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
