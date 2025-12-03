'use server';
/**
 * @fileOverview An AI flow that searches medical literature and provides summaries.
 *
 * - secondOpinionSearch - A function that handles the medical literature search.
 * - SecondOpinionSearchInput - The input type for the secondOpinionSearch function.
 * - SecondOpinionSearchOutput - The return type for the secondOpinionSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SecondOpinionSearchInputSchema = z.object({
  query: z.string().describe('The search query for medical literature (e.g., medication, interaction, or condition).'),
});
export type SecondOpinionSearchInput = z.infer<typeof SecondOpinionSearchInputSchema>;

const PaperSchema = z.object({
  title: z.string().describe('The title of the research paper.'),
  publication: z.string().describe('The journal or source of the publication.'),
  publicationDate: z.string().describe('The date the paper was published.'),
  summary: z.string().describe('An AI-generated, plain-language summary of the paper.'),
  keyFindings: z.array(z.string()).describe('A list of key findings from the paper.'),
  citationCount: z.number().describe('The number of times the paper has been cited.'),
  relevanceScore: z.number().describe('A score from 0 to 100 indicating relevance to the query.'),
  fullTextUrl: z.string().url().describe('The URL to the full text of the paper.'),
});

const SecondOpinionSearchOutputSchema = z.object({
  papers: z.array(PaperSchema).describe('A list of 5-10 relevant research papers, ranked by relevance.'),
});
export type SecondOpinionSearchOutput = z.infer<typeof SecondOpinionSearchOutputSchema>;

export async function secondOpinionSearch(input: SecondOpinionSearchInput): Promise<SecondOpinionSearchOutput> {
  return secondOpinionSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'secondOpinionSearchPrompt',
  input: { schema: SecondOpinionSearchInputSchema },
  output: { schema: SecondOpinionSearchOutputSchema },
  prompt: `You are an AI research assistant specializing in medical literature. Your task is to search for peer-reviewed research papers based on the user's query and return a list of the top 5-10 most relevant results.

  User Query: {{{query}}}

  For each paper you find, you must provide:
  1.  The full title.
  2.  The publication source (e.g., "The New England Journal of Medicine").
  3.  The publication date.
  4.  A concise, plain-language summary of the paper's abstract and conclusions.
  5.  A list of 2-3 key findings.
  6.  The citation count.
  7.  A relevance score based on the user's query.
  8.  A direct URL to the full text of the paper (use placeholder URLs if necessary).

  Your response MUST be structured as a JSON object matching the output schema.`,
});

const secondOpinionSearchFlow = ai.defineFlow(
  {
    name: 'secondOpinionSearchFlow',
    inputSchema: SecondOpinionSearchInputSchema,
    outputSchema: SecondOpinionSearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
