'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      stopListening();
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      stopListening();
    };
    
    recognition.onend = () => {
      if (recognitionRef.current) {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition start error:", err);
        setError("Could not start speech recognition. It might already be running.");
        setIsListening(false);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const speak = useCallback(async (text: string) => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    setError(null);

    try {
      const { audio } = await textToSpeech({ text });
      if (audio) {
        const newAudio = new Audio(audio);
        audioRef.current = newAudio;
        newAudio.play();
        newAudio.onended = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };
      }
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError('Could not play audio response.');
      setIsSpeaking(false);
    }
  }, [isSpeaking]);
  
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsSpeaking(false);
        audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopSpeaking();
      if(recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [stopSpeaking]);

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    setTranscript,
  };
}
