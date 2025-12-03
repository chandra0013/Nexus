'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { aiHealthAssistantSynergy } from '@/ai/flows/ai-health-assistant-synergy';
import {
  Loader2,
  Sparkles,
  Mic,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ReportDisplay } from './report';
import { Chatbot } from './chatbot';
import { useToast } from '@/hooks/use-toast';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  medicationList: z
    .string()
    .min(3, 'Please enter at least one medication.'),
  healthContext: z
    .string()
    .min(10, 'Please provide some health context (e.g., age, conditions).'),
  foodQuery: z.string().optional(),
});

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const { toast } = useToast();
  const {
    isListening,
    isSpeaking,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    setTranscript,
  } = useVoiceAssistant();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicationList: '',
      healthContext: '',
      foodQuery: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await aiHealthAssistantSynergy({
        ...values,
        query: 'Please generate a medication interaction report.',
        foodQuery: values.foodQuery || 'None',
      });
      setReport(result.response);
      if (isAccessibilityMode) {
        speak(
          'Your report has been generated. I will now read the summary. ' +
            result.response.substring(0, 300)
        );
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      const errorMsg =
        'There was a problem generating your report. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: errorMsg,
      });
      if (isAccessibilityMode) {
        speak(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (transcript) {
      if (!report) {
        // Voice commands to fill the form
        if (transcript.toLowerCase().includes('medication')) {
          form.setValue('medicationList', transcript.replace(/medication/i, '').trim());
          speak('Medication list updated. What is the health context?');
        } else if (transcript.toLowerCase().includes('context')) {
          form.setValue('healthContext', transcript.replace(/context/i, '').trim());
          speak('Health context updated. Any specific food to check?');
        } else if (transcript.toLowerCase().includes('food')) {
          form.setValue('foodQuery', transcript.replace(/food/i, '').trim());
          speak('Food query updated. Ready to generate the report.');
        } else if (transcript.toLowerCase().includes('generate report')) {
          form.handleSubmit(onSubmit)();
        } else {
           speak("Sorry, I didn't understand that command. Please say 'medication' followed by your medications, or 'generate report'.");
        }
      }
      setTranscript('');
    }
  }, [transcript, report, form, speak, setTranscript]);

  useEffect(() => {
    if (voiceError) {
      toast({
        variant: 'destructive',
        title: 'Voice Assistant Error',
        description: voiceError,
      });
      if (isAccessibilityMode) {
        speak(`An error occurred: ${voiceError}`);
      }
    }
  }, [voiceError, toast, isAccessibilityMode, speak]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Contextual Interaction Checker
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Enter your information below to generate a personalized medication
          safety report.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center space-x-2">
        <Switch
          id="accessibility-mode"
          checked={isAccessibilityMode}
          onCheckedChange={setIsAccessibilityMode}
        />
        <Label htmlFor="accessibility-mode" className="text-lg">
          Accessibility Mode (Voice Control)
        </Label>
      </div>

      <div className="mt-12">
        {!report && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="medicationList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Medication List</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Lisinopril 10mg, Metformin 500mg, Atorvastatin 20mg..."
                        className="min-h-[120px] bg-card/50 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter each medication, one per line is best. Include dosage
                      if known.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="healthContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Personal Health Context
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Age 65, diagnosed with Type 2 Diabetes and high blood pressure. Allergic to penicillin."
                        className="min-h-[120px] bg-card/50 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is crucial for a contextual analysis. Please include
                      age, known conditions, and major allergies.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="foodQuery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Specific Food/Supplement Query (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Grapefruit, St. John's Wort, Vitamin D"
                        className="bg-card/50 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Want to check for an interaction with a specific food or
                      supplement? Enter it here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={isLoading || isSpeaking}
                  className="w-full flex-1 animate-pulse-glow rounded-full bg-accent px-8 py-7 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-accent/40"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Generating Your Report...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-6 w-6" />
                      Analyze Now
                    </>
                  )}
                </Button>
                {isAccessibilityMode && (
                   <Button
                    type="button"
                    onClick={toggleListening}
                    disabled={isLoading || isSpeaking}
                    size="icon"
                    className={`h-14 w-14 rounded-full transition-colors ${
                      isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {isListening ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    <span className="sr-only">{isListening ? 'Stop Listening' : 'Start Listening'}</span>
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}

        {report && (
          <div>
            <ReportDisplay
              report={report}
              onReset={() => {
                setReport(null);
                form.reset();
              }}
            />
            <Chatbot report={report} isAccessibilityMode={isAccessibilityMode} />
          </div>
        )}
      </div>
    </div>
  );
}
