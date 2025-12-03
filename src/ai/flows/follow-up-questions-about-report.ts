'use server';
/**
 * @fileOverview An AI chatbot that answers follow-up questions about a medication interaction report.
 *
 * - followUpQuestionsAboutReport - A function that handles the chatbot interaction and returns a response.
 * - FollowUpQuestionsAboutReportInput - The input type for the followUpQuestionsAboutReport function.
 * - FollowUpQuestionsAboutReportOutput - The return type for the followUpQuestionsAboutReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FollowUpQuestionsAboutReportInputSchema = z.object({
  report: z.string().describe('The medication interaction report to ask follow-up questions about.'),
  question: z.string().describe('The follow-up question to ask about the medication interaction report.'),
});
export type FollowUpQuestionsAboutReportInput = z.infer<typeof FollowUpQuestionsAboutReportInputSchema>;

const FollowUpQuestionsAboutReportOutputSchema = z.object({
  answer: z.string().describe('The answer to the follow-up question about the medication interaction report.'),
});
export type FollowUpQuestionsAboutReportOutput = z.infer<typeof FollowUpQuestionsAboutReportOutputSchema>;

export async function followUpQuestionsAboutReport(input: FollowUpQuestionsAboutReportInput): Promise<FollowUpQuestionsAboutReportOutput> {
  return followUpQuestionsAboutReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'followUpQuestionsAboutReportPrompt',
  input: {schema: FollowUpQuestionsAboutReportInputSchema},
  output: {schema: FollowUpQuestionsAboutReportOutputSchema},
  prompt: `You are an AI chatbot that answers follow-up questions about a medication interaction report.\n\n  Medication Interaction Report: {{{report}}}\n\n  Follow-up Question: {{{question}}}\n\n  Answer: `,
});

const followUpQuestionsAboutReportFlow = ai.defineFlow(
  {
    name: 'followUpQuestionsAboutReportFlow',
    inputSchema: FollowUpQuestionsAboutReportInputSchema,
    outputSchema: FollowUpQuestionsAboutReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
