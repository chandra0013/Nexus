'use server';
/**
 * @fileOverview An AI flow that provides a preliminary analysis of medical images.
 *
 * - contextualImageAnalyzer - A function that handles the image analysis.
 * - ContextualImageAnalyzerInput - The input type for the function.
 * - ContextualImageAnalyzerOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ContextualImageAnalyzerInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a skin condition, wound, or other symptom, as a data URI."
    ),
  symptoms: z.string().optional().describe('Any associated symptoms the user is experiencing.'),
});
export type ContextualImageAnalyzerInput = z.infer<
  typeof ContextualImageAnalyzerInputSchema
>;

const ContextualImageAnalyzerOutputSchema = z.object({
  possibleConditions: z.array(z.object({
    condition: z.string(),
    likelihood: z.number(),
  })).describe('A list of possible conditions, ranked by likelihood.'),
  severity: z.enum(['Mild', 'Moderate', 'Severe', 'Unknown']).describe('The assessed severity of the condition.'),
  whenToSeeDoctor: z.string().describe('Clear guidance on when to seek professional medical care.'),
  medicationInteractionNotes: z.string().optional().describe('Notes on potential medication interactions if a treatment is prescribed.'),
  disclaimer: z.string().describe('A strong disclaimer that this is not a medical diagnosis.'),
});
export type ContextualImageAnalyzerOutput = z.infer<
  typeof ContextualImageAnalyzerOutputSchema
>;

export async function contextualImageAnalyzer(
  input: ContextualImageAnalyzerInput
): Promise<ContextualImageAnalyzerOutput> {
  return contextualImageAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualImageAnalyzerPrompt',
  input: { schema: ContextualImageAnalyzerInputSchema },
  output: { schema: ContextualImageAnalyzerOutputSchema },
  prompt: `You are an AI medical assistant that provides a preliminary analysis of user-submitted images of medical symptoms (like rashes, wounds, etc.). Your analysis is NOT a diagnosis but a helpful guide.

  Image provided: {{media url=imageDataUri}}
  User-described symptoms: {{{symptoms}}}

  1.  Analyze the image and symptoms to identify possible conditions. Provide a ranked list with likelihood percentages.
  2.  Assess the severity as Mild, Moderate, or Severe.
  3.  Provide a clear "When to See a Doctor" recommendation, including any red flag symptoms that require immediate attention.
  4.  If applicable, provide notes on what types of medications might be prescribed and what interactions to check for with the Nexus-Med tool.
  5.  Crucially, you MUST start your entire response with a disclaimer: "This is not a medical diagnosis. Please consult a healthcare professional for an accurate diagnosis."

  Your response MUST be a JSON object matching the output schema.`,
});

const contextualImageAnalyzerFlow = ai.defineFlow(
  {
    name: 'contextualImageAnalyzerFlow',
    inputSchema: ContextualImageAnalyzerInputSchema,
    outputSchema: ContextualImageAnalyzerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
