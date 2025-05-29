// src/app/generate/page.tsx
"use client";

import { useState, useCallback, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import PromptPanel from '@/components/PromptPanel';
import GenerationPanel from '@/components/GenerationPanel';
import HistoryPanel from '@/components/HistoryPanel';
import type { GenerationItem } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from 'next/image';


export default function GeneratePage() {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [history, setHistory] = useLocalStorage<GenerationItem[]>('visicraft-history', []);
  const [isGeneratingAny, setIsGeneratingAny] = useState(false); // Tracks if any generation is ongoing
  const [viewedItem, setViewedItem] = useState<GenerationItem | null>(null);


  const { toast } = useToast();

  const currentPromptToUse = enhancedPrompt.trim() || originalPrompt.trim();

  const addHistoryItem = useCallback((item: GenerationItem) => {
    setHistory(prevHistory => [item, ...prevHistory].slice(0, 6)); // Keep last 6 items
  }, [setHistory]);

  const clearHistory = () => {
    setHistory([]);
    toast({ title: "History Cleared", description: "Your generation history has been cleared." });
  };
  
  const handleViewItem = (item: GenerationItem) => {
    setViewedItem(item);
  };

  const handleDownloadItem = (item: GenerationItem) => {
    if (!item.urls || item.urls.length === 0) {
      toast({ title: "Download Error", description: "No content to download.", variant: "destructive" });
      return;
    }
    const link = document.createElement('a');
    link.href = item.urls[0]; // Download the first item in the array
    link.download = item.type === 'image' 
      ? `visicraft_history_image_${item.id}.png` 
      : `visicraft_history_video_${item.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: `Historical ${item.type} download has started.` });
  };
  
  // Prevent leaving page if generation is in progress
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isGeneratingAny) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isGeneratingAny]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-950">
      <PageHeader showNav={true} />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8">
            <PromptPanel
              originalPrompt={originalPrompt}
              setOriginalPrompt={setOriginalPrompt}
              enhancedPrompt={enhancedPrompt}
              setEnhancedPrompt={setEnhancedPrompt}
              isGenerating={isGeneratingAny}
            />
            <HistoryPanel
              history={history}
              onClearHistory={clearHistory}
              onViewItem={handleViewItem}
              onDownloadItem={handleDownloadItem}
              isGenerating={isGeneratingAny}
            />
          </div>
          <div className="lg:col-span-2">
            <GenerationPanel
              currentPrompt={currentPromptToUse}
              originalPromptUsed={originalPrompt}
              addHistoryItem={addHistoryItem}
              isGeneratingAny={isGeneratingAny}
              setIsGeneratingAny={setIsGeneratingAny}
            />
          </div>
        </div>
      </main>
       {viewedItem && viewedItem.urls && viewedItem.urls.length > 0 && (
        <Dialog open={!!viewedItem} onOpenChange={(open) => !open && setViewedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>View Generation: {viewedItem.type === 'image' ? 'Image' : 'Video'}</DialogTitle>
              <DialogDescription>
                Prompt: "{viewedItem.finalPrompt}"
                {viewedItem.type === 'image' && viewedItem.urls.length > 1 && (
                  <span className="block text-xs text-muted-foreground mt-1">
                    Showing the first of {viewedItem.urls.length} generated images.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 max-h-[70vh] overflow-auto rounded-md">
              {viewedItem.type === 'image' ? (
                <Image src={viewedItem.urls[0]} alt="Viewed Image" width={800} height={800} className="w-full h-auto object-contain rounded" />
              ) : (
                <video src={viewedItem.urls[0]} controls className="w-full h-auto rounded" aria-label="Viewed Video Player">
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
       <footer className="text-center py-6 border-t border-border/30 mt-8">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} VisiCraft AI. Create with AI.</p>
      </footer>
    </div>
  );
}
