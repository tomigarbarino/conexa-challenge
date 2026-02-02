'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface CharacterPanelProps {
  position: 'left' | 'right';
}

export function CharacterPanel({ position }: CharacterPanelProps) {
  const isLeft = position === 'left';

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6 space-y-4">
        <h2 className={`text-lg font-semibold ${isLeft ? 'text-left' : 'text-right'}`}>
          {isLeft ? 'Personaje 1' : 'Personaje 2'}
        </h2>

        {/* Placeholder skeleton cards */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="p-4 bg-muted/30 border-muted cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
