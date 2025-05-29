// src/components/HistoryPanel.tsx
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Download, Eye, History, ImageIcon, VideoIcon, FileText, PlusCircle } from 'lucide-react';
import type { GenerationItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface HistoryPanelProps {
  history: GenerationItem[];
  onClearHistory: () => void;
  onViewItem: (item: GenerationItem) => void;
  onDownloadItem: (item: GenerationItem) => void;
  isGenerating: boolean;
}

const HistoryPanel: FC<HistoryPanelProps> = ({ history, onClearHistory, onViewItem, onDownloadItem, isGenerating }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <History className="h-6 w-6 text-primary" />
          Generation History
        </CardTitle>
        <CardDescription>
          Your last {history.length > 0 ? history.length : 'few'} generations. History is stored locally.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearHistory}
            className="mb-4 w-full text-muted-foreground hover:text-destructive hover:border-destructive/50"
            disabled={isGenerating}
            aria-label="Clear all generation history"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear All History
          </Button>
        )}
        <ScrollArea className="h-[250px] md:h-[300px] pr-3"> {/* Adjust height as needed */}
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No generations yet.</p>
              <p className="text-sm">Your creations will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="p-3 border border-border/70 rounded-lg bg-background/50 flex items-start gap-3 transition-all hover:border-primary/50">
                  <div className="flex-shrink-0 w-16 h-16 rounded-md bg-muted flex items-center justify-center overflow-hidden relative">
                    {item.type === 'image' && item.urls && item.urls.length > 0 ? (
                       <Image src={item.urls[0]} alt="Generated thumbnail" width={64} height={64} className="object-cover w-full h-full" />
                    ) : item.type === 'video' && item.urls && item.urls.length > 0 ? (
                      <VideoIcon className="h-8 w-8 text-primary" />
                    ) : (
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    )}
                    {item.type === 'image' && item.urls && item.urls.length > 1 && (
                      <div 
                        className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded-tl-md flex items-center"
                        title={`${item.urls.length} images generated`}
                      >
                        <PlusCircle size={10} className="mr-0.5" /> {item.urls.length}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs text-muted-foreground capitalize">{item.type} &bull; {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                    <p className="text-sm font-medium truncate text-foreground/90" title={item.finalPrompt}>
                      {item.finalPrompt}
                    </p>
                     <div className="mt-1.5 flex gap-1.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onViewItem(item)} title="View Item" aria-label="View generation item">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDownloadItem(item)} title="Download Item" aria-label="Download generation item">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryPanel;
