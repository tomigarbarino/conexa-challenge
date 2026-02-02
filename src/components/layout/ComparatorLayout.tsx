'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { Header } from './Header';
import { CharacterPanel } from '@/features/characters/components/CharacterPanel';
import { EpisodeList } from '@/features/episodes/components/EpisodeList';

export function ComparatorLayout() {
  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden bg-background">
      {/* Header fijo */}
      <Header />

      {/* Main Content Grid */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Section - Characters (60%) */}
        <div className="flex-[0.6] flex overflow-hidden border-b">
          {/* Left Character Panel */}
          <div className="flex-1 overflow-hidden">
            <CharacterPanel position="left" />
          </div>

          {/* Separator vertical */}
          <Separator orientation="vertical" className="h-full" />

          {/* Right Character Panel */}
          <div className="flex-1 overflow-hidden">
            <CharacterPanel position="right" />
          </div>

          {/* Botón flotante PLUS - centrado entre los headers */}
          <Button
            size="icon"
            className="rounded-full absolute left-1/2 -translate-x-1/2 top-7 z-20 shadow-xl h-14 w-14 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Bottom Section - Episodes/Results (40%) */}
        <div className="flex-[0.4] flex overflow-hidden">
          {/* Episode 1 */}
          <div className="flex-1 overflow-hidden border-r">
            <EpisodeList />
          </div>

          {/* Separator vertical */}
          <Separator orientation="vertical" className="h-full" />

          {/* Episode 2 */}
          <div className="flex-1 overflow-hidden border-r">
            <EpisodeList />
          </div>

          {/* Separator vertical */}
          <Separator orientation="vertical" className="h-full" />

          {/* Comparison Result */}
          <div className="flex-1 overflow-hidden">
            <EpisodeList />
          </div>
        </div>
      </div>
    </div>
  );
}
