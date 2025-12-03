'use server';

/**
 * @fileOverview An AI health assistant that helps users understand medication warnings and interactions.
 *
 * - aiHealthAssistantSynergy - A function that handles the AI health assistant process.
 * - AiHealthAssistantSynergyInput - The input type for the aiHealthAssistantSynergy function.
 * - AiHealthAssistantSynergyOutput - The return type for the aiHealthAssistantSynergy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiHealthAssistantSynergyInputSchema = z.object({
  query: z.string().describe('The user query regarding medication warnings or interactions.'),
  medicationList: z
    .string()
    .optional()
    .describe('A comma-separated list of medications the user is taking.'),
  foodQuery: z
    .string()
    .optional()
    .describe(
      'A specific food query related to potential medication interactions.'
    ),
  healthContext: z
    .string()
    .optional()
    .describe(
      "The user's personal health context, including age, allergies, and diagnoses."
    ),
  report: z.string().optional().describe('Optional: The medication interaction report to provide context.'),
});
export type AiHealthAssistantSynergyInput = z.infer<typeof AiHealthAssistantSynergyInputSchema>;

const AiHealthAssistantSynergyOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user query.'),
});
export type AiHealthAssistantSynergyOutput = z.infer<typeof AiHealthAssistantSynergyOutputSchema>;

export async function aiHealthAssistantSynergy(input: AiHealthAssistantSynergyInput): Promise<AiHealthAssistantSynergyOutput> {
  return aiHealthAssistantSynergyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHealthAssistantSynergyPrompt',
  input: {schema: AiHealthAssistantSynergyInputSchema},
  output: {schema: AiHealthAssistantSynergyOutputSchema},
  prompt: `You are Nexus-Med's AI Health Assistant, named Synergy. You are designed to help users understand their medication interaction reports and any related questions they might have. You will not provide medical advice or change prescriptions.

  If the user is asking for a report, use the following information to generate it:
  Medication List: {{{medicationList}}}
  Food Query: {{{foodQuery}}}
  Health Context: {{{healthContext}}}

  If you are generating a report, you MUST format it in Markdown using the following structure. Do not include extra blank lines between sections.

  ## 🧾 Contextual Medication Interaction Report
  
  ### 1. Patient Profile Summary
  A concise overview of the provided personal health context.
  - **Age / Sex:** (if available)
  - **Key Diagnoses / Conditions:** (e.g., Type 2 Diabetes, Hypertension)
  - **Allergies / Sensitivities:**
  - **Lifestyle or Relevant Context:** (if given — e.g., smoker, drinks alcohol, vegetarian)
  
  ---
  
  ### 2. Medication Overview
  List of all medications (with dosage if provided).
  * **Medication:** Lisinopril, **Dosage:** 10 mg, **Purpose / Class:** ACE inhibitor (for blood pressure), **Notes:** —
  * **Medication:** Metformin, **Dosage:** 500 mg, **Purpose / Class:** Antidiabetic (for Type 2 Diabetes), **Notes:** —
  
  ---
  
  ### 3. Drug–Drug Interaction Analysis
  Detailed assessment of potential interactions between medications in the list.
  For each interaction:
  * **Medications Involved:** e.g., Lisinopril + Spironolactone
  * **Interaction Type:** Pharmacodynamic / Pharmacokinetic
  * **Severity Level:** (Minor / Moderate / Major / Contraindicated)
  * **Clinical Impact:** What could happen (e.g., increased risk of hyperkalemia)
  * **Recommendation:** Action to take (e.g., monitor potassium, avoid combination, dosage adjustment)
  
  ---
  
  ### 4. Drug–Condition Interactions
  Cross-reference each medication with the user’s known conditions.
  * **Medication:**
  * **Condition Affected:**
  * **Risk / Explanation:**
  * **Recommendation / Monitoring Advice:**
  
  ---
  
  ### 5. Drug–Allergy or Sensitivity Warnings
  If the patient lists allergies, flag any medication that could cross-react.
  * **Allergy:** Penicillin
  * **Concern:** Cephalosporins (e.g., cefuroxime) may cross-react → use with caution.
  
  ---
  
  ### 6. Food / Supplement Interaction Check (if applicable)
  Analyzes any food or supplement entered by the user.
  * **Food / Supplement Queried:** Grapefruit
  * **Medication(s) Affected:** Atorvastatin
  * **Interaction Mechanism:** CYP3A4 inhibition
  * **Potential Effect:** Increased statin levels → muscle toxicity risk
  * **Recommendation:** Avoid grapefruit or limit intake.
  
  ---
  
  ### 7. Overall Safety Summary
  A concise synthesis highlighting: Major interactions requiring immediate attention, Moderate risks needing monitoring, and Medications generally safe together.
  * **Next Steps:** (e.g., consult pharmacist, schedule lab monitoring)
  
  ---
  
  ### 8. Professional Disclaimer
  This report is for informational purposes only and does not replace professional medical advice. Always consult your physician or pharmacist before making any changes to your medication regimen.

  If the user is asking a follow-up question, use the provided report for context.
  Existing medication interaction report for context: {{{report}}}

  Respond to the following user query: {{{query}}}`,
});

const aiHealthAssistantSynergyFlow = ai.defineFlow(
  {
    name: 'aiHealthAssistantSynergyFlow',
    inputSchema: AiHealthAssistantSynergyInputSchema,
    outputSchema: AiHealthAssistantSynergyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
