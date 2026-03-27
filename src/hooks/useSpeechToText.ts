import { useState, useRef, useCallback } from "react";
import OpenAI from "openai";

interface UseSpeechToTextOptions {
  onResult: (transcript: string) => void;
}

export function useSpeechToText({ onResult }: UseSpeechToTextOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Keep onResult in a ref to avoid re-creating callbacks
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const isSupported =
    typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia;

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }, []);

  const transcribeWithWhisper = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      // Convert Blob to File (Whisper requires a File object)
      const audioFile = new File([audioBlob], "recording.webm", {
        type: audioBlob.type || "audio/webm",
      });

      const response = await client.audio.transcriptions.create({
        model: "whisper-1",
        file: audioFile,
      });

      if (response.text && response.text.trim()) {
        onResultRef.current(response.text.trim());
      } else {
        setError("No speech detected.");
      }
    } catch (err: any) {
      console.error("Whisper transcription error:", err);
      setError(err.message || "Transcription failed.");
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError("Microphone is not supported in this browser.");
      return;
    }

    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Pick the best available audio format
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
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        cleanup();

        // Only transcribe if we recorded meaningful audio
        if (audioBlob.size > 1000) {
          transcribeWithWhisper(audioBlob);
        } else {
          setError("Recording too short. Please speak longer.");
        }
      };

      // Collect data every 250ms for reliability
      mediaRecorder.start(250);
      setIsListening(true);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setError("Microphone access denied. Check browser permissions.");
      cleanup();
    }
  }, [isSupported, cleanup, transcribeWithWhisper]);

  const stopListening = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop(); // This triggers onstop → transcribeWithWhisper
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isTranscribing,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}
