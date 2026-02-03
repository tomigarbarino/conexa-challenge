'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeCharTab, setActiveCharTab] = useState<'left' | 'right'>('left');
  const [activeEpisodeTab, setActiveEpisodeTab] = useState<'left' | 'shared' | 'right'>('shared');

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden bg-background">
      <Header />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Desktop: Side by side panels */}
        <div className="hidden md:flex flex-[0.6] overflow-hidden border-b">
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

        {/* Mobile: Tabs for character panels */}
        <div className="flex md:hidden flex-[0.55] flex-col overflow-hidden border-b">
          <Tabs value={activeCharTab} onValueChange={(v) => setActiveCharTab(v as 'left' | 'right')} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-full grid grid-cols-2 rounded-none border-b h-10 flex-shrink-0">
              <TabsTrigger value="left" className="rounded-none data-[state=active]:bg-primary/10">
                Personaje 1 {selectedCharA ? `✓` : ''}
              </TabsTrigger>
              <TabsTrigger value="right" className="rounded-none data-[state=active]:bg-primary/10">
                Personaje 2 {selectedCharB ? `✓` : ''}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="left" className="flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden">
              <ErrorBoundary>
                <CharacterPanel position="left" />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="right" className="flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden">
              <ErrorBoundary>
                <CharacterPanel position="right" />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-[0.45] md:flex-[0.4] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b bg-muted/30 flex-shrink-0">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Comparación</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={!hasResults || isLoading}
              className="h-7 text-xs"
              title="Descargar resultados como CSV"
            >
              <Download className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </Button>
          </div>
          
          {/* Desktop: 3 columns side by side */}
          <div className="hidden md:flex flex-1 overflow-hidden">
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

          {/* Mobile: Tabs for episode columns */}
          <div className="flex md:hidden flex-1 flex-col overflow-hidden">
            <Tabs value={activeEpisodeTab} onValueChange={(v) => setActiveEpisodeTab(v as 'left' | 'shared' | 'right')} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="w-full grid grid-cols-3 rounded-none border-b h-9 flex-shrink-0">
                <TabsTrigger value="left" className="rounded-none text-xs px-1 data-[state=active]:bg-primary/10">
                  P1 ({columns.left.length})
                </TabsTrigger>
                <TabsTrigger value="shared" className="rounded-none text-xs px-1 data-[state=active]:bg-primary/10">
                  Ambos ({columns.middle.length})
                </TabsTrigger>
                <TabsTrigger value="right" className="rounded-none text-xs px-1 data-[state=active]:bg-primary/10">
                  P2 ({columns.right.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="left" className="flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden">
                <ErrorBoundary>
                  <EpisodeList 
                    title="Solo Personaje 1"
                    episodes={columns.left}
                    isLoading={isLoading}
                    emptyMessage={selectedCharA ? "Sin episodios exclusivos" : "Selecciona personaje 1"}
                    emptyIcon={<User className="h-10 w-10 text-muted-foreground/30 mb-2" />}
                  />
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="shared" className="flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden">
                <ErrorBoundary>
                  <EpisodeList 
                    title="Episodios Compartidos"
                    episodes={columns.middle}
                    isLoading={isLoading}
                    emptyMessage={selectedCharA && selectedCharB ? "Sin episodios en común" : "Selecciona dos personajes"}
                    emptyIcon={<Users className="h-10 w-10 text-muted-foreground/30 mb-2" />}
                  />
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="right" className="flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden">
                <ErrorBoundary>
                  <EpisodeList 
                    title="Solo Personaje 2"
                    episodes={columns.right}
                    isLoading={isLoading}
                    emptyMessage={selectedCharB ? "Sin episodios exclusivos" : "Selecciona personaje 2"}
                    emptyIcon={<User className="h-10 w-10 text-muted-foreground/30 mb-2" />}
                  />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
