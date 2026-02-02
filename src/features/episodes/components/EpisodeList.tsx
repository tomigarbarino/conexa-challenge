'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

export function EpisodeList() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold sticky top-0 bg-background/95 py-2">
          Episodios
        </h3>

        {/* Placeholder skeleton cards */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Card
            key={i}
            className="p-3 bg-muted/30 border-muted cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
