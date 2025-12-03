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
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Loader2, Sparkles, AlertCircle, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  polypharmacyAssistant,
  type PolypharmacyAssistantOutput,
} from '@/ai/flows/polypharmacy-assistant';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  medications: z
    .string()
    .min(10, 'Please enter at least two medications to analyze.'),
});

type Report = PolypharmacyAssistantOutput;

const getRiskVariant = (risk: string) => {
  switch (risk.toLowerCase()) {
    case 'low': return 'default';
    case 'moderate': return 'secondary';
    case 'high': return 'destructive';
    default: return 'outline';
  }
}

export default function PolypharmacyAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { medications: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await polypharmacyAssistant(values);
      setReport(result);
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: 'There was a problem analyzing your medications for polypharmacy risks.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Polypharmacy Risk & Deprescribing Assistant
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          For those on 5+ medications, identify which might be safely reduced or
          discontinued.
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Analyze Your Medication Regimen</CardTitle>
          <CardDescription>
            Enter your full list of medications to calculate your polypharmacy
            risk score.
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
                      <Textarea
                        placeholder="Enter all medications, one per line..."
                        className="min-h-[200px]"
                        {...field}
                      />
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
                    Assessing Risk...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Analyze My Regimen
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-primary">
                Your Deprescribing Report
              </CardTitle>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Polypharmacy Risk Score</p>
                <Badge variant={getRiskVariant(report.riskScore)} className="text-lg">
                  {report.riskScore}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-headline text-lg font-semibold">
                Potentially Inappropriate Medications
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on Beers Criteria and other clinical guidelines.
              </p>
              <ul className="mt-2 space-y-2">
                {report.inappropriateMedications.map((med, i) => (
                  <li key={i} className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                    <p className="font-semibold text-destructive">{med.name}</p>
                    <p className="text-sm text-destructive/80">{med.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">
                Deprescribing Recommendations
              </h3>
              <ul className="mt-2 space-y-2">
                {report.deprescribingRecommendations.map((rec, i) => (
                  <li key={i} className="rounded-md border border-border bg-card p-3">
                    <p className="font-semibold">{rec.medicationToStop}</p>
                    <p className="mt-1 text-sm text-foreground/80">{rec.evidence}</p>
                    <p className="mt-2 text-xs font-semibold">Safer Alternative: <span className="font-normal">{rec.saferAlternative}</span></p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-accent/50 bg-accent/10 p-4">
              <h3 className="flex items-center gap-2 font-headline text-lg font-semibold text-accent">
                <FileText /> Doctor Discussion Guide
              </h3>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-accent-foreground/80">
                {report.doctorDiscussionGuide}
              </pre>
              <Button variant="outline" className="mt-4 w-full">
                Print Discussion Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
