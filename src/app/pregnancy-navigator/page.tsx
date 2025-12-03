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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Loader2, Sparkles, AlertTriangle, CheckCircle, Baby } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  pregnancySafetyNavigator,
  type PregnancySafetyNavigatorOutput,
} from '@/ai/flows/pregnancy-navigator';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  medications: z
    .string()
    .min(3, 'Please enter at least one medication.'),
  stage: z.enum([
    'pre-conception',
    'first-trimester',
    'second-trimester',
    'third-trimester',
    'breastfeeding',
  ]),
});

type SafetyReport = PregnancySafetyNavigatorOutput;

const stageLabels = {
  'pre-conception': 'Pre-Conception',
  'first-trimester': 'First Trimester (Weeks 1-13)',
  'second-trimester': 'Second Trimester (Weeks 14-26)',
  'third-trimester': 'Third Trimester (Weeks 27-40)',
  'breastfeeding': 'Breastfeeding',
};

const getBadgeVariant = (safetyLevel: string) => {
  switch (safetyLevel.toLowerCase()) {
    case 'safe':
    case 'generally safe':
      return 'default';
    case 'use with caution':
      return 'secondary';
    case 'avoid if possible':
    case 'contraindicated':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function PregnancyNavigatorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<SafetyReport | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: '',
      stage: 'first-trimester',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await pregnancySafetyNavigator(values);
      setReport(result);
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: 'There was a problem generating the safety report.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
         <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
            <Baby className="h-12 w-12 text-primary" />
          </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Pregnancy & Medication Safety Navigator
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Evidence-based guidance for every trimester and during breastfeeding,
          providing the reassurance you need.
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Check Your Medications</CardTitle>
          <CardDescription>
            Enter your current medications and select your stage to generate a
            personalized safety report.
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
                    <FormLabel className="text-lg">Your Medications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Sertraline 50mg, Loratadine 10mg, Prenatal Vitamins..."
                        className="min-h-[120px] bg-card/50 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter each medication, one per line is best.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Current Stage
                    </FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your current stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pre-conception">{stageLabels['pre-conception']}</SelectItem>
                        <SelectItem value="first-trimester">{stageLabels['first-trimester']}</SelectItem>
                        <SelectItem value="second-trimester">{stageLabels['second-trimester']}</SelectItem>
                        <SelectItem value="third-trimester">{stageLabels['third-trimester']}</SelectItem>
                        <SelectItem value="breastfeeding">{stageLabels['breastfeeding']}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full animate-pulse-glow rounded-full bg-accent px-8 py-7 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Generating Safety Report...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Analyze for My Stage
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
              Your Personalized Safety Report
            </CardTitle>
            <CardDescription>
              Stage: {stageLabels[report.stage as keyof typeof stageLabels]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {report.medicationReports.map((medReport, index) => (
              <Card key={index} className="bg-background/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      {medReport.medicationName}
                    </CardTitle>
                    <Badge variant={getBadgeVariant(medReport.safetyLevel)}>
                      {medReport.safetyLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Summary</h4>
                    <p className="mt-1 text-sm text-foreground/80">
                      {medReport.summary}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Evidence</h4>
                    <p className="mt-1 text-sm text-foreground/80">
                      {medReport.evidence}
                    </p>
                  </div>
                  {medReport.alternatives && medReport.alternatives.length > 0 && (
                     <div>
                      <h4 className="font-semibold">Safer Alternatives</h4>
                      <p className="mt-1 text-sm text-foreground/80">
                        {medReport.alternatives.join(', ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

             <div className="pt-4">
                <h3 className="font-headline text-xl font-bold">Overall Recommendations</h3>
                <p className="mt-2 text-foreground/80">{report.overallRecommendations}</p>
              </div>

            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <h4 className="font-bold">Professional Disclaimer</h4>
                  <p className="text-sm">
                    {report.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
                <Button>Generate Doctor Letter</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
