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
import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Activity } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  behavioralHealthHabitTracker,
  type BehavioralHealthHabitTrackerOutput,
} from '@/ai/flows/behavioral-health-habit-tracker';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';

const formSchema = z.object({
  medicationList: z.string().min(3, 'Please enter at least one medication.'),
  culturalContext: z.enum(['Indian', 'American', 'MiddleEastern', 'None']),
  // This form will just capture today's habits for simplicity
  sleepHours: z.coerce.number().min(0).max(24),
  stressLevel: z.coerce.number().min(1).max(10),
  exercised: z.boolean(),
  medicationAdherence: z.boolean(),
});

type Report = BehavioralHealthHabitTrackerOutput;

// Generate mock historical data for the demo using deterministic seeding
const generateMockHistory = (today: z.infer<typeof formSchema>, seed: number = 0) => {
  // Deterministic pseudo-random generator using seed
  const seededRandom = (index: number) => {
    const x = Math.sin((seed + index) * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  return Array.from({ length: 6 }).map((_, i) => ({
    sleepHours: Math.max(0, today.sleepHours + (seededRandom(i * 2) - 0.5) * 4),
    stressLevel: Math.max(1, Math.min(10, today.stressLevel + Math.floor((seededRandom(i * 2 + 1) - 0.5) * 4))),
    exercised: seededRandom(i * 3) > 0.5,
    medicationAdherence: seededRandom(i * 3 + 1) > 0.2,
  })).concat({
      sleepHours: today.sleepHours,
      stressLevel: today.stressLevel,
      exercised: today.exercised,
      medicationAdherence: today.medicationAdherence,
  });
};


export default function HabitTrackerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  // Ensure component only renders on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicationList: '',
      culturalContext: 'None',
      sleepHours: 7,
      stressLevel: 5,
      exercised: false,
      medicationAdherence: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReport(null);
    try {
      const mockHistory = generateMockHistory(values, Date.now());
      const result = await behavioralHealthHabitTracker({
        medicationList: values.medicationList,
        culturalContext: values.culturalContext,
        habitHistory: mockHistory,
      });
      setReport(result);
      toast({
        title: 'Report Generated Successfully',
        description: 'Your behavioral health analysis is ready!',
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      const errorMessage = error instanceof Error ? error.message : 'There was a problem analyzing your habit data. Please ensure your Gemini API key is valid.';
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const chartData = report ? 
      [
        { name: 'Sleep', value: report.weeklySummary.avgSleepHours, goal: 8 },
        { name: 'Exercise', value: report.weeklySummary.exerciseDays, goal: 4 },
        { name: 'Adherence', value: report.weeklySummary.adherenceRate, goal: 100 },
      ]
    : [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
          <Activity className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Behavioral Health & Habit Tracker
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Monitor your daily habits and discover how they correlate with your
          medication's effectiveness.
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Daily Habit Log</CardTitle>
          <CardDescription>
            Enter today's data to receive your weekly analysis and personalized
            nudges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="medicationList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Medications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Sertraline 50mg, Lamotrigine 100mg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sleepHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours Slept: {field.value}h</FormLabel>
                      <FormControl>
                        <Slider
                          min={0} max={16} step={0.5}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="stressLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stress Level: {field.value}/10</FormLabel>
                      <FormControl>
                        <Slider
                          min={1} max={10} step={1}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="culturalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cultural Context for Nudges</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select context" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="American">American</SelectItem>
                          <SelectItem value="Indian">Indian</SelectItem>
                          <SelectItem value="MiddleEastern">Middle Eastern</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="exercised"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 rounded-md border p-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Exercised Today?</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicationAdherence"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 rounded-md border p-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Took All Meds?</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full animate-pulse-glow rounded-full bg-accent px-8 py-7 text-lg font-bold"
              >
                {isLoading ? 'Analyzing Habits...' : 'Analyze My Week'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {report && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-black">
              <Sparkles className="mb-2 inline-block mr-2 h-6 w-6 text-black" />
              Your Weekly Behavioral Health Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="border-l-4 border-primary bg-primary/5 p-4">
              <h3 className="font-headline text-lg font-semibold text-primary">Weekly Summary</h3>
               <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                  <p className="text-sm text-black">Average Sleep</p>
                  <p className="text-2xl font-bold text-black">{report.weeklySummary.avgSleepHours.toFixed(1)}h</p>
                </div>
                <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                  <p className="text-sm text-black">Exercise Days</p>
                  <p className="text-2xl font-bold text-black">{report.weeklySummary.exerciseDays}/7</p>
                </div>
                <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                  <p className="text-sm text-black">Adherence Rate</p>
                  <p className="text-2xl font-bold text-black">{report.weeklySummary.adherenceRate.toFixed(0)}%</p>
                </div>
              </div>
              <div className="mt-4 h-[250px] w-full">
                <ResponsiveContainer>
                   <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="hsl(var(--primary))" name="Your Week" />
                      <Bar dataKey="goal" fill="hsl(var(--border))" name="Goal" />
                   </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
              <h3 className="font-headline text-lg font-semibold text-black">
                🔗 Key Correlations
              </h3>
              <ul className="mt-3 space-y-2">
                {report.correlations.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-black">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
              <h3 className="font-headline text-lg font-semibold text-black">
                💡 Personalized Nudges
              </h3>
              <ul className="mt-3 space-y-2">
                {report.nudges.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-black">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
             <div className="border-l-4 border-green-600 bg-green-50 p-4">
              <h3 className="font-headline text-lg font-semibold text-black">
                ✅ Action Plan for This Week
              </h3>
              <ol className="mt-3 space-y-2">
                {report.actionPlan.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-black">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white flex-shrink-0 text-xs font-bold">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
