'use server';

/**
 * @fileOverview An AI health assistant that helps users understand medication warnings and interactions.
 *
 * - aiHealthAssistantSynergy - A function that handles the AI health assistant process.
 * - AiHealthAssistantSynergyInput - The input type for the aiHealthAssistantSynergy function.
 * - AiHealthAssistantSynergyOutput - The return type for the aiHealthAssistantSynergy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiHealthAssistantSynergyInputSchema = z.object({
  query: z.string().describe('The user query regarding medication warnings or interactions.'),
  report: z.string().optional().describe('Optional: The medication interaction report to provide context.'),
});
export type AiHealthAssistantSynergyInput = z.infer<typeof AiHealthAssistantSynergyInputSchema>;

const AiHealthAssistantSynergyOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user query.'),
});
export type AiHealthAssistantSynergyOutput = z.infer<typeof AiHealthAssistantSynergyOutputSchema>;

export async function aiHealthAssistantSynergy(input: AiHealthAssistantSynergyInput): Promise<AiHealthAssistantSynergyOutput> {
  return aiHealthAssistantSynergyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHealthAssistantSynergyPrompt',
  input: {schema: AiHealthAssistantSynergyInputSchema},
  output: {schema: AiHealthAssistantSynergyOutputSchema},
  prompt: `You are Nexus-Med's AI Health Assistant, named Synergy. You are designed to help users understand their medication interaction reports and any related questions they might have. You will not provide medical advice or change prescriptions. 

  If provided, here is the medication interaction report: {{{report}}}

  Respond to the following user query: {{{query}}}`,
});

const aiHealthAssistantSynergyFlow = ai.defineFlow(
  {
    name: 'aiHealthAssistantSynergyFlow',
    inputSchema: AiHealthAssistantSynergyInputSchema,
    outputSchema: AiHealthAssistantSynergyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
