// src/components/PromptPanel.tsx
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, Edit, RotateCcw, Loader2, Edit3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { enhancePrompt, type EnhancePromptInput } from '@/ai/flows/enhance-prompt';

interface PromptPanelProps {
  originalPrompt: string;
  setOriginalPrompt: (prompt: string) => void;
  enhancedPrompt: string;
  setEnhancedPrompt: (prompt: string) => void;
  isGenerating: boolean;
}

const PromptPanel: FC<PromptPanelProps> = ({
  originalPrompt,
  setOriginalPrompt,
  enhancedPrompt,
  setEnhancedPrompt,
  isGenerating,
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const handleEnhancePrompt = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a prompt to enhance.",
        variant: "destructive",
      });
      return;
    }
    setIsEnhancing(true);
    try {
      const input: EnhancePromptInput = { prompt: originalPrompt };
      const result = await enhancePrompt(input);
      setEnhancedPrompt(result.enhancedPrompt);
      toast({
        title: "Prompt Enhanced",
        description: "Your prompt has been successfully enhanced by AI.",
      });
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance the prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Edit3 className="h-6 w-6 text-primary" />
          Craft Your Prompt
        </CardTitle>
        <CardDescription>
          Enter your idea below. Use the "Enhance" button for AI assistance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="originalPrompt" className="text-sm font-medium text-foreground/80">
            Your Idea / Prompt
          </label>
          <Textarea
            id="originalPrompt"
            placeholder="e.g., A futuristic cityscape at sunset, neon lights reflecting on wet streets"
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
            rows={4}
            className="resize-none"
            disabled={isEnhancing || isGenerating}
          />
        </div>

        <Button
          onClick={handleEnhancePrompt}
          disabled={isEnhancing || isGenerating || !originalPrompt.trim()}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isEnhancing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Enhance Prompt with AI
        </Button>

        {enhancedPrompt && (
          <div className="space-y-2 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center">
              <label htmlFor="enhancedPrompt" className="text-sm font-medium text-foreground/80">
                AI Enhanced Prompt
              </label>
              <Button variant="ghost" size="sm" onClick={() => setEnhancedPrompt('')} disabled={isGenerating}>
                <RotateCcw className="mr-2 h-3 w-3" /> Clear
              </Button>
            </div>
            <Textarea
              id="enhancedPrompt"
              value={enhancedPrompt}
              onChange={(e) => setEnhancedPrompt(e.target.value)}
              rows={6}
              className="resize-none bg-background/50"
              disabled={isGenerating}
              aria-label="Editable AI Enhanced Prompt"
            />
            <p className="text-xs text-muted-foreground">
              You can edit the enhanced prompt before generating.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptPanel;
