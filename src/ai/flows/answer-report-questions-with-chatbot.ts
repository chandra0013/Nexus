'use server';
/**
 * @fileOverview An AI chatbot that answers questions about a medication interaction report.
 *
 * - answerReportQuestionsWithChatbot - A function that handles the chatbot interaction and returns a response.
 * - AnswerReportQuestionsWithChatbotInput - The input type for the answerReportQuestionsWithChatbot function.
 * - AnswerReportQuestionsWithChatbotOutput - The return type for the answerReportQuestionsWithChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerReportQuestionsWithChatbotInputSchema = z.object({
  report: z.string().describe('The medication interaction report to ask questions about.'),
  question: z.string().describe('The question to ask about the medication interaction report.'),
});
export type AnswerReportQuestionsWithChatbotInput = z.infer<typeof AnswerReportQuestionsWithChatbotInputSchema>;

const AnswerReportQuestionsWithChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the medication interaction report.'),
});
export type AnswerReportQuestionsWithChatbotOutput = z.infer<typeof AnswerReportQuestionsWithChatbotOutputSchema>;

export async function answerReportQuestionsWithChatbot(input: AnswerReportQuestionsWithChatbotInput): Promise<AnswerReportQuestionsWithChatbotOutput> {
  return answerReportQuestionsWithChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerReportQuestionsWithChatbotPrompt',
  input: {schema: AnswerReportQuestionsWithChatbotInputSchema},
  output: {schema: AnswerReportQuestionsWithChatbotOutputSchema},
  prompt: `You are an AI chatbot that answers questions about a medication interaction report.

  Medication Interaction Report: {{{report}}}

  Question: {{{question}}}

  Answer: `,
});

const answerReportQuestionsWithChatbotFlow = ai.defineFlow(
  {
    name: 'answerReportQuestionsWithChatbotFlow',
    inputSchema: AnswerReportQuestionsWithChatbotInputSchema,
    outputSchema: AnswerReportQuestionsWithChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
