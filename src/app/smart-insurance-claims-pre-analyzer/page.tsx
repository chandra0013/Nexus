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
import { useState, useRef } from 'react';
import {
  Loader2,
  Sparkles,
  Upload,
  FileCheck,
  FileWarning,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  smartInsuranceClaimsPreAnalyzer,
  type SmartInsuranceClaimsPreAnalyzerOutput,
} from '@/ai/flows/smart-insurance-claims-pre-analyzer';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  insurancePolicy: z.any().refine((file) => file, 'Please upload your insurance policy.'),
  prescription: z.any().refine((file) => file, 'Please upload your prescription.'),
  medicalRecords: z.any().refine((file) => file, 'Please upload relevant medical records.'),
});

type AnalysisResult = SmartInsuranceClaimsPreAnalyzerOutput;

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function SmartClaimsAnalyzerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  
  const [fileNames, setFileNames] = useState({
    insurancePolicy: '',
    prescription: '',
    medicalRecords: '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof fileNames) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileNames(prev => ({...prev, [fieldName]: file.name}));
      form.setValue(fieldName, file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResults(null);
    try {
      const [insurancePolicyDataUri, prescriptionDataUri, medicalRecordsDataUri] = await Promise.all([
          fileToDataUri(values.insurancePolicy),
          fileToDataUri(values.prescription),
          fileToDataUri(values.medicalRecords),
      ]);

      const result = await smartInsuranceClaimsPreAnalyzer({
          insurancePolicyDataUri,
          prescriptionDataUri,
          medicalRecordsDataUri,
      });
      setResults(result);
    } catch (error) {
      console.error('Failed to analyze claim:', error);
      toast({
        variant: 'destructive',
        title: 'Error Analyzing Claim',
        description: 'There was a problem analyzing your documents. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Smart Insurance Claims Pre-Analyzer
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Predict your claim's approval likelihood and fix issues before you
          file.
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Analyze Your Claim</CardTitle>
          <CardDescription>
            Upload your insurance policy, prescription, and medical records to
            get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {(Object.keys(fileNames) as (keyof typeof fileNames)[]).map((key) => (
                   <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-lg capitalize">{key.replace(/([A-Z])/g, ' $1')}</FormLabel>
                        <FormControl>
                           <label className="flex w-full cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-border bg-card/50 p-4 text-center text-sm text-muted-foreground hover:border-primary hover:bg-primary/5">
                            <Upload className="h-5 w-5" />
                            <span>{fileNames[key] || 'Click to upload document'}</span>
                            <Input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, key)}
                            />
                          </label>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full animate-pulse-glow rounded-full bg-accent px-8 py-7 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Pre-Analyze My Claim
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Your Claim Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <CardDescription>Claim Readiness Score</CardDescription>
              <div className="flex items-center gap-4">
                 <Progress value={results.claimReadinessScore} className="h-4" />
                 <span className="text-2xl font-bold text-foreground">
                    {results.claimReadinessScore}/100
                 </span>
              </div>
               <p className={`mt-1 text-sm font-semibold ${results.claimReadinessScore > 70 ? 'text-primary' : 'text-accent'}`}>
                {results.claimReadinessScore > 70 ? 'Likely to be Approved' : 'Potential Issues Found'}
               </p>
            </div>
            
            {results.redFlags.length > 0 && (
              <div>
                <h3 className="font-headline text-lg font-semibold text-destructive">Red Flags</h3>
                 <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-destructive">
                    {results.redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                 </ul>
              </div>
            )}
            
            {results.missingDocuments.length > 0 && (
              <div>
                <h3 className="font-headline text-lg font-semibold text-accent">Missing Documents</h3>
                 <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-accent">
                    {results.missingDocuments.map((doc, i) => <li key={i}>{doc}</li>)}
                 </ul>
              </div>
            )}

            <div>
              <h3 className="font-headline text-lg font-semibold text-primary">Recommendations</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground/80">
                  {results.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
            
            <div className="rounded-md border border-border bg-background/50 p-4">
              <h4 className="font-semibold">Predicted Timeline</h4>
              <p className="text-foreground/80">{results.predictedTimeline}</p>
            </div>

            <Button className="w-full">Generate Claim Correction Documents</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
