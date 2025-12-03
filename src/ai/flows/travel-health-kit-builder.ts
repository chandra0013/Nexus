'use server';
/**
 * @fileOverview An AI flow that generates a travel health report for a given destination.
 *
 * - travelHealthKitBuilder - A function that handles the report generation.
 * - TravelHealthKitBuilderInput - The input type for the function.
 * - TravelHealthKitBuilderOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TravelHealthKitBuilderInputSchema = z.object({
  destination: z.string().describe('The destination country or region.'),
  duration: z.number().describe('The duration of the trip in days.'),
  medications: z
    .string()
    .describe('A comma-separated list of the user\'s medications.'),
});
export type TravelHealthKitBuilderInput = z.infer<
  typeof TravelHealthKitBuilderInputSchema
>;

const TravelHealthKitBuilderOutputSchema = z.object({
  climateEffects: z.string().describe('How climate and altitude might affect the medications.'),
  foodInteractions: z.array(z.string()).describe('A list of potential local food interactions.'),
  diseaseRisks: z.array(z.string()).describe('A list of prevalent disease risks in the area.'),
  restrictedMedications: z.array(z.object({
    name: z.string(),
    reason: z.string(),
    alternative: z.string().optional(),
  })).describe('A list of medications that are restricted in the destination.'),
  physicianLetter: z.string().describe('An auto-generated physician letter for customs.'),
  packingChecklist: z.array(z.string()).describe('A packing checklist for medications.'),
  emergencyContacts: z.array(z.object({
    name: z.string(),
    contact: z-string(),
  })).describe('A list of emergency contacts at the destination.'),
});
export type TravelHealthKitBuilderOutput = z.infer<
  typeof TravelHealthKitBuilderOutputSchema
>;

export async function travelHealthKitBuilder(
  input: TravelHealthKitBuilderInput
): Promise<TravelHealthKitBuilderOutput> {
  return travelHealthKitBuilderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'travelHealthKitBuilderPrompt',
  input: { schema: TravelHealthKitBuilderInputSchema },
  output: { schema: TravelHealthKitBuilderOutputSchema },
  prompt: `You are a travel medicine specialist AI. For a trip to {{{destination}}} for {{{duration}}} days, with the following medications: {{{medications}}}, generate a comprehensive travel health report.

  The report must include:
  1.  **Climate & Altitude Effects:** How the destination's climate could impact medication stability and efficacy.
  2.  **Local Food Interactions:** Common foods in the region that could interact with the user's meds.
  3.  **Disease Risks:** Prevalent diseases (e.g., malaria, dengue) and relevant precautions.
  4.  **Restricted Medications:** Identify any medications that are banned or restricted in the destination, with reasons and alternatives.
  5.  **Physician Letter:** A formatted letter for customs, translated into the local language, explaining the need for these medications.
  6.  **Packing Checklist:** A quantity-calculated list of medications to pack.
  7.  **Emergency Contacts:** A list of English-speaking hospitals and the local embassy contact.

  Your response must be a JSON object matching the output schema.`,
});

const travelHealthKitBuilderFlow = ai.defineFlow(
  {
    name: 'travelHealthKitBuilderFlow',
    inputSchema: TravelHealthKitBuilderInputSchema,
    outputSchema: TravelHealthKitBuilderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
