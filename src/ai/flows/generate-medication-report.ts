'use server';
/**
 * @fileOverview Generates a medication interaction report based on user inputs.
 *
 * - generateMedicationReport - A function that generates the medication report.
 * - GenerateMedicationReportInput - The input type for the generateMedicationReport function.
 * - GenerateMedicationReportOutput - The return type for the generateMedicationReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMedicationReportInputSchema = z.object({
  medicationList: z
    .string()
    .describe('A comma-separated list of medications the user is taking.'),
  foodQuery: z
    .string()
    .describe(
      'A specific food query related to potential medication interactions.'
    ),
  healthContext: z
    .string()
    .describe(
      "The user's personal health context, including age, allergies, and diagnoses."
    ),
});

export type GenerateMedicationReportInput = z.infer<
  typeof GenerateMedicationReportInputSchema
>;

const GenerateMedicationReportOutputSchema = z.object({
  report:
    z.string()
      .describe(
        'A comprehensive, easy-to-understand, AI-generated report with contextual alerts regarding medication interactions.'
      ),
});


export type GenerateMedicationReportOutput = z.infer<
  typeof GenerateMedicationReportOutputSchema
>;


export async function generateMedicationReport(
  input: GenerateMedicationReportInput
): Promise<GenerateMedicationReportOutput> {
  return generateMedicationReportFlow(input);
}

const generateMedicationReportPrompt = ai.definePrompt({
  name: 'generateMedicationReportPrompt',
  input: { schema: GenerateMedicationReportInputSchema },
  output: { schema: GenerateMedicationReportOutputSchema },
  prompt: `You are an AI assistant specializing in providing medication interaction reports.\n
  Based on the user's medication list, food query, and health context, synthesize data from DrugBank, ML models, and the Gemini API to generate a comprehensive and easy-to-understand report with contextual alerts.\n
  Medication List: {{{medicationList}}}\n  Food Query: {{{foodQuery}}}\n  Health Context: {{{healthContext}}}\n
  Format the report to be easily readable and highlight any potential risks or interactions.`, // Corrected Handlebars syntax
});


const generateMedicationReportFlow = ai.defineFlow(
  {
    name: 'generateMedicationReportFlow',
    inputSchema: GenerateMedicationReportInputSchema,
    outputSchema: GenerateMedicationReportOutputSchema,
  },
  async input => {
    const { output } = await generateMedicationReportPrompt(input);
    return output!;
  }
);
