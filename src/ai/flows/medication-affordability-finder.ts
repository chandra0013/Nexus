'use server';
/**
 * @fileOverview Finds the most affordable options for a given medication in the Indian context.
 *
 * - medicationAffordabilityFinder - A function that searches for cost-saving options.
 * - MedicationAffordabilityFinderInput - The input type for the function.
 * - MedicationAffordabilityFinderOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MedicationAffordabilityFinderInputSchema = z.object({
  medication: z.string().describe('A comma-separated list of medications.'),
  dosage: z.string().optional().describe('The dosage of the medication (if uniform for all).'),
});
export type MedicationAffordabilityFinderInput = z.infer<
  typeof MedicationAffordabilityFinderInputSchema
>;

const MedicationAffordabilityFinderOutputSchema = z.object({
  medicationSavings: z.array(
    z.object({
      medicationName: z.string().describe('The name of the medication.'),
      results: z.array(
        z.object({
          pharmacy: z.string().describe('The name of the pharmacy or provider (e.g., 1mg, Netmeds, Apollo Pharmacy).'),
          distance: z.string().optional().describe('The distance if it is a local pharmacy.'),
          price: z.string().describe('The price for the brand name medication in INR.'),
          genericAlternative: z.object({
            name: z.string(),
            price: z.string(),
          }).optional().describe('Information about a cheaper, generic alternative available in India.'),
          coupon: z.string().optional().describe('Any available coupon or discount from Indian providers.'),
        })
      ).describe('A list of savings opportunities for this specific medication in India.'),
    })
  )
});
export type MedicationAffordabilityFinderOutput = z.infer<
  typeof MedicationAffordabilityFinderOutputSchema
>;

export async function medicationAffordabilityFinder(
  input: MedicationAffordabilityFinderInput
): Promise<MedicationAffordabilityFinderOutput> {
  return medicationAffordabilityFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationAffordabilityFinderPrompt',
  input: { schema: MedicationAffordabilityFinderInputSchema },
  output: { schema: MedicationAffordabilityFinderOutputSchema },
  prompt: `You are an AI assistant that finds the most affordable options for medications within the Indian context.
  For each medication in the list "{{medication}}", search for prices across Indian pharmacies (like Apollo Pharmacy), online pharmacies (like 1mg, Netmeds, PharmEasy), and find generic alternatives from Indian manufacturers.
  If a dosage is provided ({{dosage}}), apply it to all medications. Otherwise, assume a standard dosage.
  For each medication, also find any relevant coupons or patient assistance programs, including Indian government schemes like Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP).
  Return a structured list of the best options with prices in Indian Rupees (INR), grouped by each medication name.`,
});

const medicationAffordabilityFinderFlow = ai.defineFlow(
  {
    name: 'medicationAffordabilityFinderFlow',
    inputSchema: MedicationAffordabilityFinderInputSchema,
    outputSchema: MedicationAffordabilityFinderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
