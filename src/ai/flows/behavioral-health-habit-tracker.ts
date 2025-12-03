'use server';
/**
 * @fileOverview An AI flow that analyzes user-tracked habits and their impact on medications.
 *
 * - behavioralHealthHabitTracker - A function that handles the analysis.
 * - BehavioralHealthHabitTrackerInput - The input type for the function.
 * - BehavioralHealthHabitTrackerOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HabitDataSchema = z.object({
  sleepHours: z.number().describe('Hours of sleep.'),
  stressLevel: z.number().min(1).max(10).describe('Stress level from 1 to 10.'),
  exercised: z.boolean().describe('Whether the user exercised.'),
  medicationAdherence: z.boolean().describe('Whether medications were taken as prescribed.'),
});

const BehavioralHealthHabitTrackerInputSchema = z.object({
  medicationList: z.string().describe('A comma-separated list of medications.'),
  habitHistory: z.array(HabitDataSchema).describe('An array of habit data for the past week.'),
  culturalContext: z.enum(['Indian', 'American', 'MiddleEastern', 'None']).describe('The user\'s cultural background for tailored nudges.'),
});
export type BehavioralHealthHabitTrackerInput = z.infer<
  typeof BehavioralHealthHabitTrackerInputSchema
>;

const BehavioralHealthHabitTrackerOutputSchema = z.object({
  weeklySummary: z.object({
      avgSleepHours: z.number(),
      exerciseDays: z.number(),
      adherenceRate: z.number(),
  }).describe('A summary of the week\'s habits.'),
  correlations: z.array(z.string()).describe('Key correlations identified between habits and potential medication efficacy.'),
  nudges: z.array(z.string()).describe('Personalized, culturally-aware micro-habit suggestions.'),
  actionPlan: z.array(z.string()).describe('A simple, step-by-step action plan for the week.'),
});
export type BehavioralHealthHabitTrackerOutput = z.infer<
  typeof BehavioralHealthHabitTrackerOutputSchema
>;

export async function behavioralHealthHabitTracker(
  input: BehavioralHealthHabitTrackerInput
): Promise<BehavioralHealthHabitTrackerOutput> {
  return behavioralHealthHabitTrackerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'behavioralHealthHabitTrackerPrompt',
  input: { schema: BehavioralHealthHabitTrackerInputSchema },
  output: { schema: BehavioralHealthHabitTrackerOutputSchema },
  prompt: `You are an AI behavioral health coach. Analyze the user's weekly habit data and its potential impact on their medications.

  User's Medications: {{{medicationList}}}
  Cultural Context: {{{culturalContext}}}
  Habit History (Past 7 Days):
  {{#each habitHistory}}
  - Sleep: {{sleepHours}}h, Stress: {{stressLevel}}/10, Exercised: {{exercised}}, Adherence: {{medicationAdherence}}
  {{/each}}

  Your task:
  1.  Calculate and return a 'weeklySummary' containing average sleep hours, total exercise days, and medication adherence rate (%).
  2.  Identify 2-3 key 'correlations' between the habits and medications (e.g., "On days with less than 6 hours of sleep, the effectiveness of your SSRI may be reduced.").
  3.  Generate 2-3 personalized and culturally-appropriate 'nudges' based on the user's cultural context. For example, for an 'Indian' context, suggest yoga; for an 'American' context, suggest running or gym.
  4.  Create a simple, step-by-step 'actionPlan' for the user to follow this week.

  Your response MUST be a JSON object matching the output schema.`,
});


const behavioralHealthHabitTrackerFlow = ai.defineFlow(
  {
    name: 'behavioralHealthHabitTrackerFlow',
    inputSchema: BehavioralHealthHabitTrackerInputSchema,
    outputSchema: BehavioralHealthHabitTrackerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
