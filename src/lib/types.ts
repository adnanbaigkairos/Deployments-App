export interface GenerationItem {
  id: string;
  type: 'image' | 'video';
  originalPrompt: string;
  finalPrompt: string; // The prompt used for generation (could be original or enhanced)
  url: string; // Image URL or Video Data URI
  timestamp: number;
}
