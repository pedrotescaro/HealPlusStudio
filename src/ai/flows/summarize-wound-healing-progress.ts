'use server';

/**
 * @fileOverview Summarizes a patient's wound healing progress based on images and notes.
 *
 * - summarizeWoundHealingProgress - A function that summarizes the wound healing progress.
 * - SummarizeWoundHealingProgressInput - The input type for the summarizeWoundHealingProgress function.
 * - SummarizeWoundHealingProgressOutput - The return type for the summarizeWoundHealingProgress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWoundHealingProgressInputSchema = z.object({
  images: z
    .array(
      z.string().describe(
        "A photo of the wound, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      )
    )
    .describe('The images of the wound over time.'),
  notes: z.string().describe('The notes describing the wound healing progress.'),
});
export type SummarizeWoundHealingProgressInput = z.infer<
  typeof SummarizeWoundHealingProgressInputSchema
>;

const SummarizeWoundHealingProgressOutputSchema = z.object({
  summary: z.string().describe('The summary of the wound healing progress.'),
});
export type SummarizeWoundHealingProgressOutput = z.infer<
  typeof SummarizeWoundHealingProgressOutputSchema
>;

export async function summarizeWoundHealingProgress(
  input: SummarizeWoundHealingProgressInput
): Promise<SummarizeWoundHealingProgressOutput> {
  return summarizeWoundHealingProgressFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWoundHealingProgressPrompt',
  input: {schema: SummarizeWoundHealingProgressInputSchema},
  output: {schema: SummarizeWoundHealingProgressOutputSchema},
  prompt: `You are a healthcare provider summarizing a patient's wound healing progress.

  Here are the notes describing the wound healing progress: {{{notes}}}
  Here are the images of the wound over time: {{#each images}} {{media url=this}} {{/each}}

  Please provide a summary of the wound healing progress.
  `,
});

const summarizeWoundHealingProgressFlow = ai.defineFlow(
  {
    name: 'summarizeWoundHealingProgressFlow',
    inputSchema: SummarizeWoundHealingProgressInputSchema,
    outputSchema: SummarizeWoundHealingProgressOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
