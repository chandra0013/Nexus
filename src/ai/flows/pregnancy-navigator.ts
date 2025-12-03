'use server';
/**
 * @fileOverview A specialized AI flow for pregnancy and medication safety.
 *
 * - pregnancySafetyNavigator - A function that assesses medication safety for pregnancy.
 * - PregnancySafetyNavigatorInput - The input type for the function.
 * - PregnancySafetyNavigatorOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PregnancySafetyNavigatorInputSchema = z.object({
  medications: z
    .string()
    .describe('A comma-separated list of medications the user is taking.'),
  stage: z
    .enum([
      'pre-conception',
      'first-trimester',
      'second-trimester',
      'third-trimester',
      'breastfeeding',
    ])
    .describe(
      'The current stage of pregnancy or post-partum.'
    ),
});
export type PregnancySafetyNavigatorInput = z.infer<
  typeof PregnancySafetyNavigatorInputSchema
>;

const MedicationReportSchema = z.object({
  medicationName: z.string().describe('The name of the medication.'),
  safetyLevel: z
    .string()
    .describe(
      'A safety rating (e.g., "Safe", "Use with Caution", "Avoid if Possible").'
    ),
  summary: z
    .string()
    .describe(
      'A plain-language summary of the risks and considerations for the selected stage.'
    ),
  evidence: z
    .string()
    .describe('The evidence source for the recommendation (e.g., ACOG, LactMed).'),
  alternatives: z
    .array(z.string())
    .optional()
    .describe('A list of safer alternative medications, if applicable.'),
});

const PregnancySafetyNavigatorOutputSchema = z.object({
  stage: z.string().describe('The stage for which the report was generated.'),
  medicationReports: z.array(MedicationReportSchema).describe('A report for each medication provided.'),
  overallRecommendations: z.string().describe('A summary of the most important recommendations.'),
  disclaimer: z.string().describe('A standard professional disclaimer.'),
});

export type PregnancySafetyNavigatorOutput = z.infer<
  typeof PregnancySafetyNavigatorOutputSchema
>;

export async function pregnancySafetyNavigator(
  input: PregnancySafetyNavigatorInput
): Promise<PregnancySafetyNavigatorOutput> {
  return pregnancySafetyNavigatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pregnancySafetyNavigatorPrompt',
  input: { schema: PregnancySafetyNavigatorInputSchema },
  output: { schema: PregnancySafetyNavigatorOutputSchema },
  prompt: `You are an AI assistant specializing in medication safety during pregnancy and breastfeeding. Your task is to provide a detailed, evidence-based report for the user.

  User's Medications: {{{medications}}}
  Current Stage: {{{stage}}}

  For each medication, provide a detailed report including:
  1. A clear safety level for the specified stage (e.g., "Generally Safe", "Use with Caution", "Avoid if Possible", "Contraindicated").
  2. A concise summary explaining the risks and benefits in plain language.
  3. The primary evidence source for your recommendation (e.g., ACOG guidelines, specific studies, LactMed Database).
  4. A list of safer alternatives if the medication is not recommended.

  After analyzing each medication, provide a brief "Overall Recommendations" summary that highlights the most critical actions for the user.

  Finally, include a standard professional disclaimer stating this is not medical advice and the user should consult their OB/GYN.

  Your response MUST be structured as a JSON object matching the output schema.`,
});

const pregnancySafetyNavigatorFlow = ai.defineFlow(
  {
    name: 'pregnancySafetyNavigatorFlow',
    inputSchema: PregnancySafetyNavigatorInputSchema,
    outputSchema: PregnancySafetyNavigatorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
