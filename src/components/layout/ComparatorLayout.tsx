'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GitCompare } from 'lucide-react';
import { Header } from './Header';
import { CharacterPanel } from '@/features/characters/components/CharacterPanel';
import { EpisodeList } from '@/features/episodes/components/EpisodeList';
import { useEpisodeComparison } from '@/features/episodes/hooks/useEpisodeComparison';
import { useComparisonStore } from '@/store/comparison.store';

export function ComparatorLayout() {
  const [compareKey, setCompareKey] = useState(0);
  const selectedCharA = useComparisonStore(state => state.selectedCharA);
  const selectedCharB = useComparisonStore(state => state.selectedCharB);
  
  const { columns, isLoading } = useEpisodeComparison(compareKey > 0 ? compareKey : null);

  const handleCompare = () => {
    if (selectedCharA && selectedCharB) {
      // Incrementar key para trigger nueva comparación
      setCompareKey(prev => prev + 1);
    }
  };

  const canCompare = selectedCharA && selectedCharB;

  // Determinar el texto del botón según el estado
  const getButtonText = () => {
    if (!selectedCharA && !selectedCharB) return 'Selecciona dos personajes';
    if (!selectedCharA) return 'Selecciona Personaje 1';
    if (!selectedCharB) return 'Selecciona Personaje 2';
    return 'Comparar Episodios';
  };

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

          {/* Separator vertical con botón flotante */}
          <div className="relative flex items-start justify-center">
            <Separator orientation="vertical" className="h-full" />
            
            {/* Botón de comparación - en el top */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20">
              <Button
                onClick={handleCompare}
                disabled={!canCompare || isLoading}
                variant={canCompare ? 'default' : 'secondary'}
                size="icon"
                className="rounded-full shadow-xl h-14 w-14 disabled:opacity-100"
                title={!canCompare ? getButtonText() : 'Comparar episodios'}
              >
                <GitCompare className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Right Character Panel */}
          <div className="flex-1 overflow-hidden">
            <CharacterPanel position="right" />
          </div>
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
