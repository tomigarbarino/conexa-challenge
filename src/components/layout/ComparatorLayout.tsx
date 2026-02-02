'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { Header } from './Header';
import { CharacterPanel } from '@/features/characters/components/CharacterPanel';
import { EpisodeList } from '@/features/episodes/components/EpisodeList';
import { useEpisodeComparison } from '@/features/episodes/hooks/useEpisodeComparison';

export function ComparatorLayout() {
  const { columns, isLoading } = useEpisodeComparison();

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
          {/* Only Character A */}
          <div className="flex-1 overflow-hidden border-r">
            <EpisodeList 
              title="Solo Personaje 1"
              episodes={columns.left}
              isLoading={isLoading}
              emptyMessage="Selecciona el personaje 1"
            />
          </div>

          {/* Separator vertical */}
          <Separator orientation="vertical" className="h-full" />

          {/* Shared Episodes */}
          <div className="flex-1 overflow-hidden border-r">
            <EpisodeList 
              title="Episodios Compartidos"
              episodes={columns.middle}
              isLoading={isLoading}
              emptyMessage="Selecciona ambos personajes"
            />
          </div>

          {/* Separator vertical */}
          <Separator orientation="vertical" className="h-full" />

          {/* Only Character B */}
          <div className="flex-1 overflow-hidden">
            <EpisodeList 
              title="Solo Personaje 2"
              episodes={columns.right}
              isLoading={isLoading}
              emptyMessage="Selecciona el personaje 2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
