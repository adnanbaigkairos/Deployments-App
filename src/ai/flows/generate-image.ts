// src/ai/flows/generate-image.ts
'use server';
/**
 * @fileOverview Image generation flow.
 *
 * - generateImage - A function that generates one or more images from a text prompt.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The prompt to use to generate the image.'),
  numberOfImages: z.number().min(1).max(4).default(2).describe('The number of image variations to generate.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('The URLs of the generated images.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const imageUrls: string[] = [];
    const numImages = input.numberOfImages || 2; // Default to 2 if not provided

    for (let i = 0; i < numImages; i++) {
      // Add a slight variation to the prompt for each image if desired, or rely on model stochasticity
      // For now, we use the same prompt and rely on the model's inherent randomness.
      // To make it more distinct, one could append "variation ${i+1}" or similar to the prompt.
      const imagePrompt = `${input.prompt}. Ensure the generated image is square (1:1 aspect ratio).${numImages > 1 ? ` (variation ${i + 1} of ${numImages})` : ''}`;
      
      const {media} = await ai.generate({
        // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images. You MUST use exactly this model to generate images.
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: imagePrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
        },
      });
      if (media.url) {
        imageUrls.push(media.url);
      } else {
        // Handle cases where an image might not be generated, though `ai.generate` should throw for major errors.
        // This could log or push a placeholder, but for now, we assume success or a complete flow failure.
        console.warn(`Image ${i + 1} generation did not return a URL for prompt: ${input.prompt}`);
      }
    }
    
    if (imageUrls.length === 0 && numImages > 0) {
        throw new Error('No images were generated successfully.');
    }

    return {imageUrls};
  }
);
