'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  mentalHealthAnalyzer,
  type MentalHealthAnalyzerOutput,
} from '@/ai/flows/mental-health-analyzer';
import { useToast } from '@/hooks/use-toast';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

const formSchema = z.object({
  medications: z.string().min(3, 'Please enter at least one medication.'),
  mood: z.number().min(1).max(10),
  sleep: z.number().min(0).max(24),
  anxiety: z.number().min(1).max(10),
  energy: z.number().min(1).max(10),
  focus: z.number().min(1).max(10),
});

type Report = MentalHealthAnalyzerOutput;

export default function MentalHealthAnalyzerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: '',
      mood: 5,
      sleep: 8,
      anxiety: 5,
      energy: 5,
      focus: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await mentalHealthAnalyzer({
        medicationList: values.medications,
        dailyLog: {
          mood: values.mood,
          sleepHours: values.sleep,
          anxietyLevel: values.anxiety,
          energyLevel: values.energy,
          focusLevel: values.focus,
        },
      });
      setReport(result);
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description:
          'There was a problem analyzing your mental health data.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
          <BrainCircuit className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Mental Health & Medication Impact Analyzer
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Track how your medications affect your mood, sleep, and anxiety over
          time.
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Daily Check-in & Analysis</CardTitle>
          <CardDescription>
            Log your daily metrics to see correlations and get personalized
            insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Current Medications</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="e.g., Sertraline 50mg, Lamotrigine 100mg"
                        className="w-full rounded-md border border-input bg-background p-2 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {(['mood', 'anxiety', 'energy', 'focus'] as const).map(
                  (metric) => (
                    <FormField
                      key={metric}
                      control={form.control}
                      name={metric}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">
                            {metric} (1-10): {field.value}
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )
                )}
                <FormField
                  control={form.control}
                  name="sleep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sleep (hours): {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={16}
                          step={0.5}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full animate-pulse-glow rounded-full bg-accent px-8 py-7 text-lg font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Analyze My Day
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {report && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Your Mental Health Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-headline text-lg font-semibold">
                Correlation Analysis
              </h3>
              <div className="mt-4 h-[300px] w-full">
                <ResponsiveContainer>
                  <LineChart data={report.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(var(--primary))"
                    />
                    <Line
                      type="monotone"
                      dataKey="anxiety"
                      stroke="hsl(var(--accent))"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">
                Key Patterns
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                {report.patterns.map((pattern, i) => (
                  <li key={i}>{pattern}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">
                Recommendations & AI Nudges
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                {report.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
            <Button className="w-full">Export for My Therapist</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
