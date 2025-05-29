// src/components/GenerationPanel.tsx
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ImageIcon, Film, Download, Loader2, AlertTriangle, PlayCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { generateImage, type GenerateImageInput } from '@/ai/flows/generate-image';
import { generateVideo, type GenerateVideoInput } from '@/ai/flows/generate-video';
import type { GenerationItem } from '@/lib/types';
import { Progress } from "@/components/ui/progress";


interface GenerationPanelProps {
  currentPrompt: string;
  originalPromptUsed: string; // The original prompt, for history if no enhancement
  addHistoryItem: (item: GenerationItem) => void;
  isGeneratingAny: boolean;
  setIsGeneratingAny: (isGenerating: boolean) => void;
}

const GenerationPanel: FC<GenerationPanelProps> = ({
  currentPrompt,
  originalPromptUsed,
  addHistoryItem,
  isGeneratingAny,
  setIsGeneratingAny,
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { toast } = useToast();

  useEffect(() => {
    setIsGeneratingAny(isLoading);
  }, [isLoading, setIsGeneratingAny]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      let currentProgress = 0;
      // Simulate progress for image generation (approx 10s) or video (approx 30s)
      const duration = activeTab === 'image' ? 10000 : 30000;
      const interval = duration / 100;
      timer = setInterval(() => {
        currentProgress += 1;
        if (currentProgress <= 100) {
          setProgress(currentProgress);
        } else {
          clearInterval(timer);
        }
      }, interval);
    } else {
      setProgress(0); // Reset progress when not loading
    }
    return () => clearInterval(timer);
  }, [isLoading, activeTab]);


  const handleGenerate = async () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter or enhance a prompt before generating.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    if (activeTab === 'image') setGeneratedImageUrl(null);
    if (activeTab === 'video') setGeneratedVideoUrl(null);

    try {
      let resultUrl: string;
      if (activeTab === 'image') {
        const input: GenerateImageInput = { prompt: currentPrompt };
        const result = await generateImage(input);
        resultUrl = result.imageUrl;
        setGeneratedImageUrl(resultUrl);
      } else { // video
        const input: GenerateVideoInput = { prompt: currentPrompt };
        // The flow is typed to return a data URI string for video.
        const result = await generateVideo(input);
        resultUrl = result.videoDataUri;
        setGeneratedVideoUrl(resultUrl);
      }

      toast({
        title: `${activeTab === 'image' ? 'Image' : 'Video'} Generated`,
        description: `Your ${activeTab} has been successfully generated.`,
      });

      addHistoryItem({
        id: Date.now().toString(),
        type: activeTab,
        originalPrompt: originalPromptUsed,
        finalPrompt: currentPrompt,
        url: resultUrl,
        timestamp: Date.now(),
      });

    } catch (err) {
      console.error(`Error generating ${activeTab}:`, err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate ${activeTab}. ${errorMessage}`);
      toast({
        title: `${activeTab === 'image' ? 'Image' : 'Video'} Generation Failed`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100); // Ensure progress bar completes
      setTimeout(() => setProgress(0), 500); // Reset after a short delay
    }
  };

  const handleDownload = () => {
    const url = activeTab === 'image' ? generatedImageUrl : generatedVideoUrl;
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.download = activeTab === 'image' ? `visicraft_image_${Date.now()}.png` : `visicraft_video_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: `${activeTab === 'image' ? 'Image' : 'Video'} download has started.` });
  };


  return (
    <Card className="shadow-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PlayCircle className="h-7 w-7 text-primary" />
          AI Generation Studio
        </CardTitle>
        <CardDescription>
          Choose to generate an image or a video from your prompt.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'image' | 'video')} className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="image" disabled={isLoading}>
              <ImageIcon className="mr-2 h-4 w-4" /> Image Generator
            </TabsTrigger>
            <TabsTrigger value="video" disabled={isLoading}>
              <Film className="mr-2 h-4 w-4" /> Video Generator
            </TabsTrigger>
          </TabsList>

          <div className="flex-grow flex flex-col justify-between">
            <div className="flex-grow mb-6 min-h-[300px] md:min-h-[400px] border border-dashed border-border rounded-lg flex items-center justify-center bg-background/30 p-4 overflow-hidden">
              {isLoading ? (
                <div className="text-center w-full">
                  <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground/90">Generating {activeTab}...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments. Please wait.</p>
                  {progress > 0 && <Progress value={progress} className="w-3/4 mx-auto mt-4 h-2" />}
                </div>
              ) : error ? (
                <div className="text-center text-destructive">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-semibold">Generation Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : activeTab === 'image' && generatedImageUrl ? (
                <Image src={generatedImageUrl} alt="Generated Image" width={512} height={512} className="max-h-full max-w-full object-contain rounded-md shadow-md" />
              ) : activeTab === 'video' && generatedVideoUrl ? (
                <video src={generatedVideoUrl} controls className="max-h-full max-w-full object-contain rounded-md shadow-md" aria-label="Generated Video Player">
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center text-muted-foreground">
                  {activeTab === 'image' ? <ImageIcon size={64} className="mx-auto mb-4 opacity-50" /> : <Film size={64} className="mx-auto mb-4 opacity-50" />}
                  <p>Your generated {activeTab} will appear here.</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !currentPrompt.trim()}
                className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : activeTab === 'image' ? (
                  <ImageIcon className="mr-2 h-5 w-5" />
                ) : (
                  <Film className="mr-2 h-5 w-5" />
                )}
                Generate {activeTab === 'image' ? 'Image' : 'Video'}
              </Button>

              {(generatedImageUrl || generatedVideoUrl) && !isLoading && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download {activeTab === 'image' ? 'Image' : 'Video'}
                </Button>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GenerationPanel;
