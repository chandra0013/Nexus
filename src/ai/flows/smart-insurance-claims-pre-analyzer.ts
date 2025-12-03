'use server';
/**
 * @fileOverview An AI flow that analyzes insurance claim documents to predict approval likelihood.
 *
 * - smartInsuranceClaimsPreAnalyzer - A function that handles the claim analysis.
 * - SmartInsuranceClaimsPreAnalyzerInput - The input type for the function.
 * - SmartInsuranceClaimsPreAnalyzerOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartInsuranceClaimsPreAnalyzerInputSchema = z.object({
  insurancePolicyDataUri: z
    .string()
    .describe(
      "The user's insurance policy document, as a data URI."
    ),
  prescriptionDataUri: z
    .string()
    .describe('The prescription for the medication, as a data URI.'),
  medicalRecordsDataUri: z
    .string()
    .describe('Relevant medical records, as a data URI.'),
});
export type SmartInsuranceClaimsPreAnalyzerInput = z.infer<
  typeof SmartInsuranceClaimsPreAnalyzerInputSchema
>;

const SmartInsuranceClaimsPreAnalyzerOutputSchema = z.object({
  claimReadinessScore: z
    .number()
    .describe(
      'A score from 0-100 indicating the likelihood of claim approval.'
    ),
  redFlags: z
    .array(z.string())
    .describe('A list of identified issues that may lead to denial.'),
  missingDocuments: z
    .array(z.string())
    describe('A checklist of documents that are missing for a successful claim.'),
  recommendations: z
    .array(z.string())
    .describe('Actionable steps to improve the chances of approval.'),
  predictedTimeline: z.string().describe('An estimated timeline for the claim decision.'),
});
export type SmartInsuranceClaimsPreAnalyzerOutput = z.infer<
  typeof SmartInsuranceClaimsPreAnalyzerOutputSchema
>;

export async function smartInsuranceClaimsPreAnalyzer(
  input: SmartInsuranceClaimsPreAnalyzerInput
): Promise<SmartInsuranceClaimsPreAnalyzerOutput> {
  return smartInsuranceClaimsPreAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartInsuranceClaimsPreAnalyzerPrompt',
  input: { schema: SmartInsuranceClaimsPreAnalyzerInputSchema },
  output: { schema: SmartInsuranceClaimsPreAnalyzerOutputSchema },
  prompt: `You are an expert AI insurance claim analyst. Analyze the provided documents to predict the likelihood of a claim being approved and provide actionable feedback.

  Documents:
  - Insurance Policy: {{media url=insurancePolicyDataUri}}
  - Prescription: {{media url=prescriptionDataUri}}
  - Medical Records: {{media url=medicalRecordsDataUri}}

  Based on these documents, perform the following analysis:
  1.  **Calculate a Claim Readiness Score (0-100):** Assess the overall strength of the claim.
  2.  **Identify Red Flags:** List critical issues like non-formulary drugs, missing prior authorization, or documentation gaps.
  3.  **Create a Missing Documents Checklist:** Specify any documents that are missing.
  4.  **Provide Recommendations:** Suggest concrete actions to fix issues and improve approval odds.
  5.  **Predict a Timeline:** Estimate the time to a decision based on typical processing times.

  Your response MUST be a JSON object matching the output schema.`,
});

const smartInsuranceClaimsPreAnalyzerFlow = ai.defineFlow(
  {
    name: 'smartInsuranceClaimsPreAnalyzerFlow',
    inputSchema: SmartInsuranceClaimsPreAnalyzerInputSchema,
    outputSchema: SmartInsuranceClaimsPreAnalyzerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
