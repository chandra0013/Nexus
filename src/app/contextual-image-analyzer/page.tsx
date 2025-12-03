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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Loader2,
  Sparkles,
  Camera,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  contextualImageAnalyzer,
  type ContextualImageAnalyzerOutput,
} from '@/ai/flows/contextual-image-analyzer';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  image: z.any().refine((file) => file, 'Please upload an image.'),
  symptoms: z.string().optional(),
});

type AnalysisResult = ContextualImageAnalyzerOutput;

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function ImageAnalyzerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const imageDataUri = await fileToDataUri(values.image);
      const response = await contextualImageAnalyzer({
        imageDataUri,
        symptoms: values.symptoms,
      });
      setResult(response);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      toast({
        variant: 'destructive',
        title: 'Error Analyzing Image',
        description: 'There was a problem analyzing your image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
          <Camera className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Contextual Image Analysis
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Upload a photo of a rash, wound, or other visible symptom for a
          preliminary AI-powered assessment.
        </p>
        <Card className="mt-4 border-destructive/50 bg-destructive/10 text-left text-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-destructive" />
              <div>
                <p className="font-bold text-destructive">
                  This is not a medical diagnosis.
                </p>
                <p className="text-destructive/80">
                  This tool provides informational suggestions only and is not
                  a substitute for professional medical advice. Consult a
                  doctor for an accurate diagnosis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Upload Your Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image of Symptom</FormLabel>
                    <FormControl>
                      <div
                        className="flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 text-center text-muted-foreground hover:border-primary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {preview ? (
                          <Image
                            src={preview}
                            alt="Image preview"
                            width={192}
                            height={192}
                            className="h-full w-auto rounded-md object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8" />
                            <p>Click to upload or drag and drop</p>
                            <p className="text-xs">PNG, JPG, or WEBP</p>
                          </div>
                        )}
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associated Symptoms (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Itching, burning, started 2 days ago..."
                        {...field}
                      />
                    </FormControl>
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
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Analyze Now
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Preliminary Analysis
            </CardTitle>
            <CardDescription>{result.disclaimer}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-headline text-lg font-semibold">
                Possible Conditions
              </h3>
              <div className="mt-2 space-y-2">
                {result.possibleConditions.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.condition}</span>
                      <span className="font-semibold">{item.likelihood}%</span>
                    </div>
                    <Progress value={item.likelihood} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">Severity</h3>
              <Badge variant={result.severity === 'Severe' ? 'destructive' : 'secondary'}>{result.severity}</Badge>
            </div>
            <div className="rounded-md border border-accent/50 bg-accent/10 p-4">
              <h3 className="font-headline text-lg font-semibold text-accent">
                When to See a Doctor
              </h3>
              <p className="mt-2 text-sm text-accent-foreground/80">
                {result.whenToSeeDoctor}
              </p>
            </div>
            {result.medicationInteractionNotes && (
              <div>
                <h3 className="font-headline text-lg font-semibold">
                  Medication Notes
                </h3>
                <p className="mt-2 text-sm text-foreground/80">
                  {result.medicationInteractionNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
