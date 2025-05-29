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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[] | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [numberOfImagesToGenerate, setNumberOfImagesToGenerate] = useState<number>(2);

  const { toast } = useToast();

  useEffect(() => {
    setIsGeneratingAny(isLoading);
  }, [isLoading, setIsGeneratingAny]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      let currentProgress = 0;
      const baseImageDuration = 10000; // Approx 10s per image
      const videoDuration = 30000; // Approx 30s for video
      
      const totalDuration = activeTab === 'image' 
        ? baseImageDuration * numberOfImagesToGenerate 
        : videoDuration;
      
      const interval = totalDuration / 100;

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
  }, [isLoading, activeTab, numberOfImagesToGenerate]);


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
    if (activeTab === 'image') setGeneratedImageUrls(null);
    if (activeTab === 'video') setGeneratedVideoUrl(null);

    try {
      if (activeTab === 'image') {
        const input: GenerateImageInput = { prompt: currentPrompt, numberOfImages: numberOfImagesToGenerate };
        const result = await generateImage(input);
        setGeneratedImageUrls(result.imageUrls);
         if (result.imageUrls.length > 0) {
          addHistoryItem({
            id: Date.now().toString(),
            type: activeTab,
            originalPrompt: originalPromptUsed,
            finalPrompt: currentPrompt,
            urls: result.imageUrls, // Store all image URLs
            timestamp: Date.now(),
          });
        }
      } else { // video
        const input: GenerateVideoInput = { prompt: currentPrompt };
        const result = await generateVideo(input);
        setGeneratedVideoUrl(result.videoDataUri);
        addHistoryItem({
            id: Date.now().toString(),
            type: activeTab,
            originalPrompt: originalPromptUsed,
            finalPrompt: currentPrompt,
            urls: [result.videoDataUri], // Store video URL in an array
            timestamp: Date.now(),
          });
      }

      toast({
        title: `${activeTab === 'image' ? 'Image(s)' : 'Video'} Generated`,
        description: `Your ${activeTab} has been successfully generated.`,
      });

    } catch (err) {
      console.error(`Error generating ${activeTab}:`, err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate ${activeTab}. ${errorMessage}`);
      toast({
        title: `${activeTab === 'image' ? 'Image(s)' : 'Video'} Generation Failed`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100); 
      setTimeout(() => setProgress(0), 500); 
    }
  };

  const handleIndividualImageDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `visicraft_image_${Date.now()}_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: `Image ${index + 1} download has started.` });
  };
  
  const handleVideoDownload = () => {
    if (!generatedVideoUrl) return;
    const link = document.createElement('a');
    link.href = generatedVideoUrl;
    link.download = `visicraft_video_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: `Video download has started.` });
  };


  return (
    <Card className="shadow-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PlayCircle className="h-7 w-7 text-primary" />
          AI Generation Studio
        </CardTitle>
        <CardDescription>
          Choose to generate image variations or a video from your prompt.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'image' | 'video')} className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="image" disabled={isLoading}>
              <ImageIcon className="mr-2 h-4 w-4" /> Image Generator
            </TabsTrigger>
            <TabsTrigger value="video" disabled={isLoading}>
              <Film className="mr-2 h-4 w-4" /> Video Generator
            </TabsTrigger>
          </TabsList>

          {activeTab === 'image' && (
            <div className="my-4 space-y-2">
              <Label htmlFor="numImages" className="text-sm font-medium">Number of Image Variations</Label>
              <Select
                value={String(numberOfImagesToGenerate)}
                onValueChange={(val) => setNumberOfImagesToGenerate(Number(val))}
                disabled={isLoading}
              >
                <SelectTrigger id="numImages" className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map(num => (
                    <SelectItem key={num} value={String(num)}>{num} Image{num > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}


          <div className="flex-grow flex flex-col justify-between">
            <div className="flex-grow mb-6 min-h-[300px] md:min-h-[400px] border border-dashed border-border rounded-lg flex items-center justify-center bg-background/30 p-4 overflow-auto">
              {isLoading ? (
                <div className="text-center w-full">
                  <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground/90">Generating {activeTab === 'image' ? `${numberOfImagesToGenerate} image(s)` : 'video'}...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments. Please wait.</p>
                  {progress > 0 && <Progress value={progress} className="w-3/4 mx-auto mt-4 h-2" />}
                </div>
              ) : error ? (
                <div className="text-center text-destructive">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-semibold">Generation Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : activeTab === 'image' && generatedImageUrls && generatedImageUrls.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {generatedImageUrls.map((url, index) => (
                      <div key={index} className="relative group border rounded-md overflow-hidden shadow-md aspect-square">
                        <Image src={url} alt={`Generated Image ${index + 1}`} layout="fill" className="object-contain" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleIndividualImageDownload(url, index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background/90 h-8 w-8"
                          title={`Download Image ${index + 1}`}
                          aria-label={`Download Image ${index + 1}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
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
                Generate {activeTab === 'image' ? `Image${numberOfImagesToGenerate > 1 ? 's' : ''}` : 'Video'}
              </Button>

              {activeTab === 'video' && generatedVideoUrl && !isLoading && (
                <Button
                  onClick={handleVideoDownload}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
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
