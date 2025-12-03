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
  Sparkles,
  Plane,
  ClipboardList,
  HeartPulse,
  Sun,
  Mountain,
  FileText,
  Phone,
  AlertTriangle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  travelHealthKitBuilder,
  type TravelHealthKitBuilderOutput,
} from '@/ai/flows/travel-health-kit-builder';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  destination: z.string().min(2, 'Please enter a destination.'),
  duration: z.coerce.number().min(1, 'Trip must be at least 1 day.'),
  medications: z.string().min(3, 'Please enter at least one medication.'),
});

type Report = TravelHealthKitBuilderOutput;

export default function TravelKitBuilderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      duration: 7,
      medications: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await travelHealthKitBuilder(values);
      setReport(result);
    } catch (error) {
      console.error('Failed to generate travel kit:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: 'There was a problem creating your travel health kit.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
          <Plane className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Travel Health Medicine Kit Builder
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Prepare your medications for any destination on Earth, safely and
          smartly.
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Plan Your Trip</CardTitle>
          <CardDescription>
            Enter your destination, trip duration, and medications to generate a
            customized travel health report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Destination</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Thailand"
                          className="bg-card/50 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Trip Duration (days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 14"
                          className="bg-card/50 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Medications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Atorvastatin 20mg, Metformin 500mg..."
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full animate-pulse-glow rounded-full bg-accent px-8 py-7 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Building Your Travel Kit...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Generate Travel Report
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
                <CardTitle className="text-2xl font-bold text-primary">Your Travel Health Report</CardTitle>
                <CardDescription>Customized for your trip to {form.getValues('destination')}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <section>
                    <h3 className="flex items-center gap-2 font-headline text-xl font-semibold"><Sun className="h-5 w-5 text-accent"/> Climate & Altitude Effects</h3>
                    <p className="mt-2 text-sm text-foreground/80">{report.climateEffects}</p>
                </section>
                <section>
                    <h3 className="flex items-center gap-2 font-headline text-xl font-semibold"><HeartPulse className="h-5 w-5 text-accent"/> Disease Risks</h3>
                     <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground/80">
                        {report.diseaseRisks.map((risk, i) => <li key={i}>{risk}</li>)}
                    </ul>
                </section>
                 <section>
                    <h3 className="flex items-center gap-2 font-headline text-xl font-semibold"><AlertTriangle className="h-5 w-5 text-destructive"/> Restricted Medications</h3>
                    {report.restrictedMedications.length > 0 ? (
                        <ul className="mt-2 space-y-2 text-sm">
                            {report.restrictedMedications.map((med, i) => (
                                <li key={i} className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                                    <p><strong className="text-destructive">{med.name}:</strong> {med.reason}</p>
                                    {med.alternative && <p className="mt-1 text-xs">Suggested Alternative: {med.alternative}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-foreground/80">No restrictions found for your medications.</p>}
                </section>
                <section>
                    <h3 className="flex items-center gap-2 font-headline text-xl font-semibold"><ClipboardList className="h-5 w-5 text-accent"/> Packing Checklist</h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground/80">
                        {report.packingChecklist.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </section>
                 <section>
                    <h3 className="flex items-center gap-2 font-headline text-xl font-semibold"><Phone className="h-5 w-5 text-accent"/> Emergency Contacts</h3>
                     <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground/80">
                        {report.emergencyContacts.map((contact, i) => <li key={i}><strong>{contact.name}:</strong> {contact.contact}</li>)}
                    </ul>
                </section>
                <section>
                    <h3 className="flex items-center gap-2 font-headline text-xl font-semibold"><FileText className="h-5 w-5 text-accent"/> Physician Letter for Customs</h3>
                    <div className="mt-2 rounded-md border border-border bg-background/50 p-4">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/80">{report.physicianLetter}</pre>
                    </div>
                     <Button variant="outline" className="mt-4 w-full">Print Letter</Button>
                </section>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
