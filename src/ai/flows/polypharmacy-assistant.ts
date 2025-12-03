'use server';
/**
 * @fileOverview An AI flow that assesses polypharmacy risk and suggests deprescribing options.
 *
 * - polypharmacyAssistant - A function that handles the analysis.
 * - PolypharmacyAssistantInput - The input type for the function.
 * - PolypharmacyAssistantOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PolypharmacyAssistantInputSchema = z.object({
  medications: z
    .string()
    .describe('A comma-separated list of 5 or more medications.'),
});
export type PolypharmacyAssistantInput = z.infer<
  typeof PolypharmacyAssistantInputSchema
>;

const PolypharmacyAssistantOutputSchema = z.object({
  riskScore: z.enum(['Low', 'Moderate', 'High']).describe('The overall polypharmacy risk score.'),
  inappropriateMedications: z.array(z.object({
    name: z.string(),
    reason: z.string(),
  })).describe('Medications flagged as potentially inappropriate based on Beers Criteria.'),
  deprescribingRecommendations: z.array(z.object({
    medicationToStop: z.string(),
    evidence: z.string(),
    saferAlternative: z.string(),
  })).describe('A ranked list of medications that could be safely discontinued.'),
  doctorDiscussionGuide: z.string().describe('A script to help the user discuss these findings with their doctor.'),
});
export type PolypharmacyAssistantOutput = z.infer<
  typeof PolypharmacyAssistantOutputSchema
>;

export async function polypharmacyAssistant(
  input: PolypharmacyAssistantInput
): Promise<PolypharmacyAssistantOutput> {
  return polypharmacyAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'polypharmacyAssistantPrompt',
  input: { schema: PolypharmacyAssistantInputSchema },
  output: { schema: PolypharmacyAssistantOutputSchema },
  prompt: `You are an AI assistant specializing in deprescribing and polypharmacy for elderly patients.
  
  User's Medications: {{{medications}}}

  Analyze this list based on the Beers Criteria and other clinical guidelines for patients on 5+ drugs.
  1. Calculate a Polypharmacy Risk Score (Low, Moderate, High).
  2. Identify any "Potentially Inappropriate Medications" and explain why.
  3. Provide a ranked list of 1-3 "Deprescribing Recommendations" with evidence and suggest a safer alternative for each.
  4. Generate a "Doctor Discussion Guide" script that the user can print and take to their doctor.`,
});

const polypharmacyAssistantFlow = ai.defineFlow(
  {
    name: 'polypharmacyAssistantFlow',
    inputSchema: PolypharmacyAssistantInputSchema,
    outputSchema: PolypharmacyAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
