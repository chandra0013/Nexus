'use server';
/**
 * @fileOverview An AI flow that detects conflicts between lifestyle habits and medications.
 *
 * - lifestyleConflictDetector - A function that handles the analysis.
 * - LifestyleConflictDetectorInput - The input type for the function.
 * - LifestyleConflictDetectorOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const LifestyleConflictDetectorInputSchema = z.object({
  medications: z.string().describe('A comma-separated list of medications.'),
  sleepHours: z.number().describe('Hours of sleep in the last 24 hours.'),
  exercised: z.boolean().describe('Whether the user exercised in the last 24 hours.'),
  caffeineIntake: z.enum(['none', 'low', 'moderate', 'high']).describe('Caffeine intake level.'),
  mealTimes: z.string().describe('A description of meal times.'),
});
export type LifestyleConflictDetectorInput = z.infer<
  typeof LifestyleConflictDetectorInputSchema
>;

const LifestyleConflictDetectorOutputSchema = z.object({
  recommendations: z.array(z.object({
    recommendation: z.string(),
    estimatedImpact: z.string(),
  })).describe('Lifestyle recommendations to improve medication efficacy.'),
  timingGuide: z.array(z.object({
    medication: z.string(),
    optimalTime: z.string(),
  })).describe('An optimized timing guide for each medication.'),
  efficacyPredictions: z.array(z.string()).describe('Predictions on how changes could improve efficacy.'),
});
export type LifestyleConflictDetectorOutput = z.infer<
  typeof LifestyleConflictDetectorOutputSchema
>;

export async function lifestyleConflictDetector(
  input: LifestyleConflictDetectorInput
): Promise<LifestyleConflictDetectorOutput> {
  return lifestyleConflictDetectorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lifestyleConflictDetectorPrompt',
  input: { schema: LifestyleConflictDetectorInputSchema },
  output: { schema: LifestyleConflictDetectorOutputSchema },
  prompt: `You are an AI expert in pharmacokinetics and lifestyle medicine.
  
  User's Medications: {{{medications}}}
  Lifestyle Data (last 24h):
  - Sleep: {{{sleepHours}}} hours
  - Exercised: {{{exercised}}}
  - Caffeine: {{{caffeineIntake}}}
  - Meal Times: {{{mealTimes}}}

  Analyze how these lifestyle factors could conflict with or enhance the efficacy of the medications.
  1. Provide 2-3 "Lifestyle Recommendations" with an estimated impact (e.g., "+15% efficacy").
  2. Create a "Medication Timing Guide" suggesting optimal times to take each drug relative to meals, sleep, etc.
  3. Generate 1-2 "Efficacy Predictions" (e.g., "Moving your statin to dinner could improve its cholesterol-lowering effect.").
  `,
});

const lifestyleConflictDetectorFlow = ai.defineFlow(
  {
    name: 'lifestyleConflictDetectorFlow',
    inputSchema: LifestyleConflictDetectorInputSchema,
    outputSchema: LifestyleConflictDetectorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
