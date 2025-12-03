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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Loader2, Sparkles, Zap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  lifestyleConflictDetector,
  type LifestyleConflictDetectorOutput,
} from '@/ai/flows/lifestyle-conflict-detector';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  medications: z.string().min(3, 'Please enter at least one medication.'),
  sleepHours: z.coerce.number().min(0).max(24),
  exercised: z.boolean(),
  caffeineIntake: z.enum(['none', 'low', 'moderate', 'high']),
  mealTimes: z.string().min(3, 'Please describe your meal times.'),
});

type Report = LifestyleConflictDetectorOutput;

export default function LifestyleConflictDetectorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: '',
      sleepHours: 8,
      exercised: false,
      caffeineIntake: 'none',
      mealTimes: 'Breakfast around 8am, Lunch around 1pm, Dinner around 7pm',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await lifestyleConflictDetector(values);
      setReport(result);
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description:
          'There was a problem analyzing your lifestyle conflicts.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
          <Zap className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Medication-Lifestyle Conflict Detector
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Discover how your daily habits like sleep, exercise, and meal times
          affect your medications.
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Log Your Day</CardTitle>
          <CardDescription>
            Enter your habits from the last 24 hours to find optimization
            opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Medications</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Lisinopril 10mg..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="sleepHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours Slept</FormLabel>
                      <FormControl>
                        <input type="number" className="w-full rounded-md border border-input bg-background p-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="caffeineIntake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caffeine Intake</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select caffeine level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="low">Low (1 cup)</SelectItem>
                          <SelectItem value="moderate">Moderate (2-3 cups)</SelectItem>
                          <SelectItem value="high">High (4+ cups)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="exercised"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Did you exercise today?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="mealTimes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Times</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe when you ate today..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full animate-pulse-glow rounded-full bg-accent px-8 py-7 text-lg font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Detecting Conflicts...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Find My Conflicts
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
              Your Lifestyle Optimization Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-headline text-lg font-semibold">
                Lifestyle Recommendations
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-sm">
                {report.recommendations.map((rec, i) => (
                  <li key={i}>{rec.recommendation} (Est. Impact: <span className="font-bold text-primary">{rec.estimatedImpact}</span>)</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">
                Medication Timing Guide
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                {report.timingGuide.map((guide, i) => (
                  <li key={i}><strong>{guide.medication}:</strong> {guide.optimalTime}</li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="font-headline text-lg font-semibold">
                Efficacy Predictions
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                {report.efficacyPredictions.map((pred, i) => (
                  <li key={i}>{pred}</li>
                ))}
              </ul>
            </div>
            <Button className="w-full">Set Optimized Reminders</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
