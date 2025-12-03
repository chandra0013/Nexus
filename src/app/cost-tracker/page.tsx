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
import { useState } from 'react';
import {
  Loader2,
  Search,
  Pill,
  Store,
  Wallet,
  BadgePercent,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { medicationAffordabilityFinder } from '@/ai/flows/medication-affordability-finder';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  medication: z
    .string()
    .min(3, 'Please enter at least one medication.'),
  dosage: z.string().optional(),
});

type SavingsResult = {
  pharmacy: string;
  distance?: string;
  price: string;
  genericAlternative?: {
    name: string;
    price: string;
  };
  coupon?: string;
};

type MedicationSavings = {
  medicationName: string;
  results: SavingsResult[];
}

export default function CostTrackerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MedicationSavings[] | null>(null);
  const { toast } = useToast();
  const [submittedMedication, setSubmittedMedication] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medication: '',
      dosage: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResults(null);
    setSubmittedMedication(values.medication);
    try {
      const result = await medicationAffordabilityFinder(values);
      // The output is now expected to be an array of MedicationSavings
      setResults(result.medicationSavings);
    } catch (error) {
      console.error('Failed to find savings:', error);
      toast({
        variant: 'destructive',
        title: 'Error Finding Savings',
        description:
          'There was a problem finding savings for this medication. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Medication Cost Tracker & Savings Finder
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Find the lowest-cost options for your prescriptions in India without
          compromising on quality.
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Find Your Best Price</CardTitle>
          <CardDescription>
            Enter one or more medications to compare prices from local pharmacies, online
            providers, and check for generic alternatives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-lg">Medications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Lipitor, Metformin 500mg, Atorvastatin..."
                          className="min-h-[120px] bg-card/50 text-base"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Enter each medication, separated by a comma or on a new line.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full animate-pulse-glow rounded-full bg-accent px-8 py-7 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-accent/40"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Searching for Savings...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-6 w-6" />
                    Find Savings
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results && results.length > 0 && (
        <div className="mt-12 space-y-8">
          <h2 className="text-center font-headline text-3xl font-bold">
            Results for your query
          </h2>
          {results.map((medicationResult, medIndex) => (
            <div key={medIndex}>
              <h3 className="mb-4 font-headline text-2xl font-bold text-primary">
                {medicationResult.medicationName}
              </h3>
              <div className="space-y-6">
                {medicationResult.results.map((result, index) => (
                  <Card key={index} className="border-border bg-card shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="text-primary" /> {result.pharmacy}
                      </CardTitle>
                      {result.distance && (
                        <CardDescription>{result.distance}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg bg-background/50 p-4">
                        <div className="flex items-center gap-3">
                          <Wallet className="text-accent" />
                          <span className="font-semibold">Brand Price:</span>
                        </div>
                        <span className="text-lg font-bold">{result.price}</span>
                      </div>
                      {result.genericAlternative && (
                        <div className="flex items-center justify-between rounded-lg border border-primary/50 bg-primary/10 p-4">
                          <div className="flex items-center gap-3">
                            <Pill className="text-primary" />
                            <span className="font-semibold">
                              Generic ({result.genericAlternative.name}):
                            </span>
                          </div>
                          <span className="text-lg font-bold text-primary">
                            {result.genericAlternative.price}
                          </span>
                        </div>
                      )}
                      {result.coupon && (
                        <div className="flex items-center justify-center rounded-lg border border-accent/50 bg-accent/10 p-3 text-center">
                          <div className="flex items-center gap-2 text-accent">
                            <BadgePercent />
                            <span className="font-semibold">{result.coupon}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
