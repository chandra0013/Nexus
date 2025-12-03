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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Loader2,
  Search,
  BookOpen,
  Calendar,
  BarChart2,
  FileText,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  secondOpinionSearch,
  type SecondOpinionSearchOutput,
} from '@/ai/flows/second-opinion-search';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  query: z.string().min(5, 'Please enter a query of at least 5 characters.'),
});

type Paper = SecondOpinionSearchOutput['papers'][0];

export default function SecondOpinionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Paper[] | null>(null);
  const { toast } = useToast();
  const [submittedQuery, setSubmittedQuery] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResults(null);
    setSubmittedQuery(values.query);
    try {
      const result = await secondOpinionSearch(values);
      setResults(result.papers);
    } catch (error) {
      console.error('Failed to search:', error);
      toast({
        variant: 'destructive',
        title: 'Error Performing Search',
        description:
          'There was a problem searching the medical literature. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          AI-Powered Medical Literature Search
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Ask the science. Explore peer-reviewed research behind every
          medication, interaction, and condition.
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Start Your Research</CardTitle>
          <CardDescription>
            Enter a medication, interaction (e.g., "Lisinopril and Ibuprofen"),
            or condition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-4"
            >
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Metformin and kidney function'"
                        className="bg-card/50 text-base"
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
                className="rounded-full bg-accent px-8 py-6 text-base font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results && (
        <div className="mt-12 space-y-8">
          <h2 className="text-center font-headline text-3xl font-bold">
            Research Papers for &quot;{submittedQuery}&quot;
          </h2>
          {results.map((paper, index) => (
            <Card key={index} className="border-border bg-card shadow-lg">
              <CardHeader>
                <Link
                  href={paper.fullTextUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CardTitle className="text-xl text-primary hover:underline">
                    {paper.title}
                  </CardTitle>
                </Link>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" /> {paper.publication}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> {paper.publicationDate}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart2 className="h-3 w-3" />
                    Cited {paper.citationCount} times
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-accent">
                    AI-Generated Summary
                  </h4>
                  <p className="mt-1 text-sm text-foreground/80">
                    {paper.summary}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-accent">Key Findings</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                    {paper.keyFindings.map((finding, i) => (
                      <li key={i}>{finding}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <Button asChild variant="link">
                    <Link
                      href={paper.fullTextUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Read Full Paper
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
