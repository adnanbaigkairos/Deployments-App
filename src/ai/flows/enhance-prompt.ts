// src/ai/flows/enhance-prompt.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for enhancing a user-provided text prompt using AI.
 *
 * The flow takes a user prompt as input and returns an enhanced version of the prompt.
 * This is achieved using a large language model (LLM) to rewrite and enrich the original prompt.
 *
 * @interface EnhancePromptInput - The input type for the enhancePrompt function.
 * @interface EnhancePromptOutput - The output type for the enhancePrompt function.
 * @function enhancePrompt - The main function that triggers the prompt enhancement flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the prompt enhancement flow
const EnhancePromptInputSchema = z.object({
  prompt: z.string().describe('The original text prompt provided by the user.'),
});
export type EnhancePromptInput = z.infer<typeof EnhancePromptInputSchema>;

// Define the output schema for the prompt enhancement flow
const EnhancePromptOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The AI-enhanced version of the original prompt.'),
});
export type EnhancePromptOutput = z.infer<typeof EnhancePromptOutputSchema>;

// Define the main function that triggers the prompt enhancement flow
export async function enhancePrompt(input: EnhancePromptInput): Promise<EnhancePromptOutput> {
  return enhancePromptFlow(input);
}

// Define the prompt used to enhance the user prompt
const enhancePromptPrompt = ai.definePrompt({
  name: 'enhancePromptPrompt',
  input: {schema: EnhancePromptInputSchema},
  output: {schema: EnhancePromptOutputSchema},
  prompt: `You are an AI prompt enhancer. Your goal is to take a user-provided prompt and rewrite it to be more descriptive and detailed, so that an image or video generation model can produce a better result.

Original Prompt: {{{prompt}}}

Enhanced Prompt:`, //Crucially, the prompt MUST be formatted using Handlebars syntax. Do not use Jinja, Django templates, or any other templating language.
});

// Define the Genkit flow for enhancing the prompt
const enhancePromptFlow = ai.defineFlow(
  {
    name: 'enhancePromptFlow',
    inputSchema: EnhancePromptInputSchema,
    outputSchema: EnhancePromptOutputSchema,
  },
  async input => {
    const {output} = await enhancePromptPrompt(input);
    return output!;
  }
);
