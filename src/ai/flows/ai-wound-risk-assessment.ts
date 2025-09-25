'use server';
/**
 * @fileOverview Provides an AI-powered risk assessment for wound healing based on images and notes.
 *
 * - aiWoundRiskAssessment - A function that handles the wound risk assessment process.
 * - AIWoundRiskAssessmentInput - The input type for the aiWoundRiskAssessment function.
 * - AIWoundRiskAssessmentOutput - The return type for the aiWoundRiskAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIWoundRiskAssessmentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the wound, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  notes: z.string().describe('Notes about the wound and healing progress.'),
});
export type AIWoundRiskAssessmentInput = z.infer<typeof AIWoundRiskAssessmentInputSchema>;

const AIWoundRiskAssessmentOutputSchema = z.object({
  riskAssessment: z.string().describe('The AI-powered risk assessment of the wound.'),
  recommendations: z.string().describe('Recommendations for improving healing outcomes.'),
});
export type AIWoundRiskAssessmentOutput = z.infer<typeof AIWoundRiskAssessmentOutputSchema>;

export async function aiWoundRiskAssessment(
  input: AIWoundRiskAssessmentInput
): Promise<AIWoundRiskAssessmentOutput> {
  return aiWoundRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiWoundRiskAssessmentPrompt',
  input: {schema: AIWoundRiskAssessmentInputSchema},
  output: {schema: AIWoundRiskAssessmentOutputSchema},
  prompt: `You are an AI assistant specializing in wound care and healing.

You will analyze the provided wound image and notes to assess potential risks and provide recommendations for improved healing outcomes.

Analyze the following information:

Wound Image: {{media url=photoDataUri}}
Notes: {{{notes}}}

Based on the image and notes, provide a risk assessment and recommendations.
`, // Modified prompt to include image and notes analysis
});

const aiWoundRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'aiWoundRiskAssessmentFlow',
    inputSchema: AIWoundRiskAssessmentInputSchema,
    outputSchema: AIWoundRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
