'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader,
  User,
  Bot,
  Mic,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aiHealthAssistantSynergy } from '@/ai/flows/ai-health-assistant-synergy';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatbotProps = {
  report: string;
  isAccessibilityMode: boolean;
};

export function Chatbot({ report, isAccessibilityMode }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'This is your AI assistant, Synergy. Feel free to ask any questions about the report above.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    setTranscript
  } = useVoiceAssistant();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserMessage = async (content: string) => {
     if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await aiHealthAssistantSynergy({
        report: report,
        query: content,
      });
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (isAccessibilityMode) {
        speak(result.response);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorContent = 'Sorry, I encountered an error. Please try again.';
      const errorMessage: Message = {
        role: 'assistant',
        content: errorContent,
      };
      setMessages((prev) => [...prev, errorMessage]);
      if (isAccessibilityMode) {
        speak(errorContent);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleUserMessage(input);
    setInput('');
  };
  
  useEffect(() => {
    if (transcript && !isLoading) {
      handleUserMessage(transcript);
      setTranscript(''); // Clear transcript after processing
    }
  }, [transcript, isLoading, setTranscript]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking(); // Stop any ongoing speech before listening
      startListening();
    }
  };

  return (
    <div className="mt-8 flex h-[60vh] flex-col rounded-lg border border-border bg-card/80 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto pr-4">
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    message.role === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 rounded-lg bg-background/50 px-4 py-3">
                  <p className="text-sm text-foreground/90">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && !isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex-1 rounded-lg bg-background/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-foreground/70">
                    Synergy is thinking...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          {isSpeaking && (
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex-1 rounded-lg bg-background/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm text-foreground/70">
                    Synergy is speaking...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
        {isAccessibilityMode && (
          isSpeaking ? (
            <Button
              type="button"
              onClick={stopSpeaking}
              size="icon"
              className="rounded-full bg-yellow-500 text-white hover:bg-yellow-600"
            >
              <VolumeX className="h-5 w-5" />
              <span className="sr-only">Stop Speaking</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={toggleListening}
              size="icon"
              className={`rounded-full transition-colors ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              {isListening ? (
                <Square className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
              <span className="sr-only">
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </span>
            </Button>
          )
        )}
        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask a follow-up question..."}
            className="flex-1 rounded-full bg-background/70 focus:ring-accent"
            disabled={isLoading || isListening || isSpeaking}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isLoading || !input.trim() || isListening || isSpeaking}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
