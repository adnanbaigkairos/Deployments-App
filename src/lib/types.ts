export interface GenerationItem {
  id: string;
  type: 'image' | 'video';
  originalPrompt: string;
  finalPrompt: string; // The prompt used for generation (could be original or enhanced)
  urls: string[]; // Image URLs or a single Video Data URI in an array
  timestamp: number;
}
