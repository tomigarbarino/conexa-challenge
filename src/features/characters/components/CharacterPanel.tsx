'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { X, Search, Loader2, ChevronDown } from 'lucide-react';
import { useInfiniteCharacters } from '@/features/characters/hooks/useInfiniteCharacters';
import { useComparisonStore } from '@/store/comparison.store';
import { useDebounce } from '@/hooks/use-debounce';
import { Character } from '@/schemas/character';

interface CharacterPanelProps {
  position: 'left' | 'right';
}

export function CharacterPanel({ position }: CharacterPanelProps) {
  const isLeft = position === 'left';
  const [searchQuery, setSearchQuery] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const debouncedSearch = useDebounce(searchQuery, 400);
  
  const { 
    data, 
    isLoading, 
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error 
  } = useInfiniteCharacters({ name: debouncedSearch });
  
  const isSearching = searchQuery !== debouncedSearch || (isFetching && !isFetchingNextPage);

  const selectedChar = useComparisonStore(
    (state) => (isLeft ? state.selectedCharA : state.selectedCharB)
  );
  const setSelected = useComparisonStore(
    (state) => (isLeft ? state.setSelectedCharA : state.setSelectedCharB)
  );

  const characters = data?.pages.flatMap(page => page.results) || [];
  const totalCount = data?.pages[0]?.info.count || 0;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Dead':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="p-4 pb-2 flex-shrink-0 border-b">
        <h2 className={`text-lg font-semibold ${isLeft ? 'text-left' : 'text-right'}`}>
          {isLeft ? 'Personaje 1' : 'Personaje 2'}
        </h2>
      </div>

      <div className="p-4 pt-3 border-b flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9"
            aria-label="Buscar personaje por nombre"
          />
          {isSearching ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          ) : searchQuery ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
        {!isLoading && !error && (
          <p className="text-xs text-muted-foreground mt-2">
            {debouncedSearch ? (
              <>
                {characters.length === 0 ? (
                  <span>Sin resultados para &quot;{debouncedSearch}&quot;</span>
                ) : (
                  <span>{characters.length} de {totalCount} personajes</span>
                )}
              </>
            ) : (
              <span>{characters.length} de {totalCount} personajes</span>
            )}
          </p>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
          {isLoading && (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-3">
                  <div className="space-y-2">
                    <Skeleton className="h-20 w-full rounded" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md text-sm">
              Error al cargar personajes
            </div>
          )}

          {!isLoading && !error && characters.length === 0 && debouncedSearch && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">
                Sin resultados para &quot;{debouncedSearch}&quot;
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Probá con otro nombre
              </p>
            </div>
          )}

          {!isLoading && !error && characters.length === 0 && !debouncedSearch && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">
                No hay personajes disponibles
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Intentá buscando por nombre
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {characters.map((character: Character) => (
              <Card
                key={character.id}
                onClick={() => setSelected(character)}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(character)}
                tabIndex={0}
                role="button"
                aria-pressed={selectedChar?.id === character.id}
                aria-label={`Seleccionar ${character.name}`}
                className={`overflow-hidden cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  selectedChar?.id === character.id
                    ? 'ring-2 ring-primary shadow-md'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="relative h-32 overflow-hidden bg-muted flex items-center justify-center">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-sm truncate">{character.name}</h3>
                  <p className="text-xs text-muted-foreground truncate mb-2">
                    {character.species}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-[0.65rem] font-medium ${getStatusColor(character.status)}`}
                  >
                    {character.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-10 flex items-center justify-center mt-4">
            {isFetchingNextPage && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
            {!hasNextPage && characters.length > 0 && (
              <p className="text-xs text-muted-foreground">Todos los personajes cargados</p>
            )}
          </div>
          </div>
        </ScrollArea>
        
        {/* Scroll indicator */}
        {hasNextPage && !isLoading && characters.length > 4 && (
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none">
            <div className="h-12 w-full bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute bottom-2 bg-black/80 text-white rounded-full px-3 py-1 flex items-center gap-1 text-xs shadow-md animate-bounce">
              <ChevronDown className="h-3 w-3" />
              <span>Scroll para más</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
