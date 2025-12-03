'use server';
/**
 * @fileOverview An AI flow that analyzes mental health logs and medication impact.
 *
 * - mentalHealthAnalyzer - A function that handles the analysis.
 * - MentalHealthAnalyzerInput - The input type for the function.
 * - MentalHealthAnalyzerOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DailyLogSchema = z.object({
  mood: z.number().describe('A rating of mood from 1 (worst) to 10 (best).'),
  sleepHours: z.number().describe('Hours of sleep.'),
  anxietyLevel: z.number().describe('Anxiety level from 1 (low) to 10 (high).'),
  energyLevel: z.number().describe('Energy level from 1 (low) to 10 (high).'),
  focusLevel: z.number().describe('Focus level from 1 (low) to 10 (high).'),
});

const MentalHealthAnalyzerInputSchema = z.object({
  medicationList: z.string().describe('A comma-separated list of medications.'),
  dailyLog: DailyLogSchema,
});
export type MentalHealthAnalyzerInput = z.infer<
  typeof MentalHealthAnalyzerInputSchema
>;

const MentalHealthAnalyzerOutputSchema = z.object({
  chartData: z.array(z.object({
    day: z.string(),
    mood: z.number(),
    anxiety: z.number(),
  })).describe('Data for the past 7 days to be charted.'),
  patterns: z
    .array(z.string())
    .describe('Key patterns identified between medications and mental health metrics.'),
  recommendations: z
    .array(z.string())
    .describe('Actionable recommendations and AI nudges.'),
});
export type MentalHealthAnalyzerOutput = z.infer<
  typeof MentalHealthAnalyzerOutputSchema
>;

export async function mentalHealthAnalyzer(
  input: MentalHealthAnalyzerInput
): Promise<MentalHealthAnalyzerOutput> {
  return mentalHealthAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentalHealthAnalyzerPrompt',
  input: { schema: MentalHealthAnalyzerInputSchema },
  output: { schema: MentalHealthAnalyzerOutputSchema },
  prompt: `You are an AI assistant that analyzes the impact of medications on mental health.
  
  User's Medications: {{{medicationList}}}
  Today's Log:
  - Mood: {{{dailyLog.mood}}}/10
  - Sleep: {{{dailyLog.sleepHours}}} hours
  - Anxiety: {{{dailyLog.anxietyLevel}}}/10
  - Energy: {{{dailyLog.energyLevel}}}/10
  - Focus: {{{dailyLog.focusLevel}}}/10

  Based on this, and assuming historical data for the past week, perform the following:
  1. Generate realistic sample chart data for the past 7 days, ending with today's log.
  2. Identify 2-3 key patterns or correlations (e.g., "On days sleep was below 6 hours, anxiety increased by 2 points.").
  3. Provide 2-3 actionable recommendations or AI "nudges" (e.g., "Your SSRI is most effective with 7+ hours of sleep. Consider a consistent bedtime.").`,
});

const mentalHealthAnalyzerFlow = ai.defineFlow(
  {
    name: 'mentalHealthAnalyzerFlow',
    inputSchema: MentalHealthAnalyzerInputSchema,
    outputSchema: MentalHealthAnalyzerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
