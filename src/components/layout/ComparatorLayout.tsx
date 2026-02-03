'use client';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { User, Users, Download } from 'lucide-react';
import { Header } from './Header';
import { CharacterPanel } from '@/features/characters/components/CharacterPanel';
import { EpisodeList } from '@/features/episodes/components/EpisodeList';
import { useEpisodeComparison } from '@/features/episodes/hooks/useEpisodeComparison';
import { useComparisonStore } from '@/store/comparison.store';
import { useUrlSync } from '@/hooks/use-url-sync';
import { downloadAsCSV } from '@/lib/csv';

export function ComparatorLayout() {
  useUrlSync();
  
  const selectedCharA = useComparisonStore(state => state.selectedCharA);
  const selectedCharB = useComparisonStore(state => state.selectedCharB);
  
  const { columns, isLoading } = useEpisodeComparison(selectedCharA && selectedCharB ? 1 : null);

  const handleExportCSV = () => {
    const allEpisodes = [
      ...columns.left.map(ep => ({ ...ep, category: 'Only Character 1' })),
      ...columns.middle.map(ep => ({ ...ep, category: 'Shared' })),
      ...columns.right.map(ep => ({ ...ep, category: 'Only Character 2' })),
    ];
    
    if (allEpisodes.length === 0) return;
    
    const charAName = selectedCharA?.name || 'Character1';
    const charBName = selectedCharB?.name || 'Character2';
    const filename = `comparison-${charAName}-${charBName}`.replace(/\s+/g, '_');
    
    downloadAsCSV([...columns.left, ...columns.middle, ...columns.right], filename);
  };

  const hasResults = columns.left.length > 0 || columns.middle.length > 0 || columns.right.length > 0;

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden bg-background">
      <Header />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-[0.6] flex overflow-hidden border-b">
          <div className="flex-1 overflow-hidden">
            <ErrorBoundary>
              <CharacterPanel position="left" />
            </ErrorBoundary>
          </div>

          <Separator orientation="vertical" className="h-full" />

          <div className="flex-1 overflow-hidden">
            <ErrorBoundary>
              <CharacterPanel position="right" />
            </ErrorBoundary>
          </div>
        </div>

        <div className="flex-[0.4] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 flex-shrink-0">
            <span className="text-sm font-medium text-muted-foreground">Resultados de Comparación</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={!hasResults || isLoading}
              className="h-7 text-xs"
              title="Descargar resultados como CSV"
            >
              <Download className="h-3 w-3 mr-1" />
              Exportar CSV
            </Button>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-hidden border-r">
              <ErrorBoundary>
                <EpisodeList 
                  title="Solo Personaje 1"
                  episodes={columns.left}
                  isLoading={isLoading}
                  emptyMessage={selectedCharA ? "Este personaje no tiene episodios exclusivos" : "Selecciona el personaje 1"}
                  emptyIcon={<User className="h-12 w-12 text-muted-foreground/30 mb-3" />}
                />
              </ErrorBoundary>
            </div>

            <Separator orientation="vertical" className="h-full" />

            <div className="flex-1 overflow-hidden border-r">
              <ErrorBoundary>
                <EpisodeList 
                  title="Episodios Compartidos"
                  episodes={columns.middle}
                  isLoading={isLoading}
                  emptyMessage={selectedCharA && selectedCharB ? "No tienen episodios en común" : "Selecciona dos personajes para comparar"}
                  emptyIcon={<Users className="h-12 w-12 text-muted-foreground/30 mb-3" />}
                />
              </ErrorBoundary>
            </div>

            <Separator orientation="vertical" className="h-full" />

            <div className="flex-1 overflow-hidden">
              <ErrorBoundary>
                <EpisodeList 
                  title="Solo Personaje 2"
                  episodes={columns.right}
                  isLoading={isLoading}
                  emptyMessage={selectedCharB ? "Este personaje no tiene episodios exclusivos" : "Selecciona el personaje 2"}
                  emptyIcon={<User className="h-12 w-12 text-muted-foreground/30 mb-3" />}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
