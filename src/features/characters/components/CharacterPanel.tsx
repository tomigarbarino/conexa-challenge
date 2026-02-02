'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';
import { useCharacters } from '@/features/characters/hooks/useCharacters';
import { useComparisonStore } from '@/store/comparison.store';
import { Character } from '@/schemas/character';

interface CharacterPanelProps {
  position: 'left' | 'right';
}

export function CharacterPanel({ position }: CharacterPanelProps) {
  const isLeft = position === 'left';
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useCharacters({ name: searchQuery || undefined });

  const selectedChar = useComparisonStore(
    (state) => (isLeft ? state.selectedCharA : state.selectedCharB)
  );
  const setSelected = useComparisonStore(
    (state) => (isLeft ? state.setSelectedCharA : state.setSelectedCharB)
  );

  const characters = data?.results || [];

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
      {/* Header */}
      <div className="p-4 pb-2 flex-shrink-0 border-b">
        <h2 className={`text-lg font-semibold ${isLeft ? 'text-left' : 'text-right'}`}>
          {isLeft ? 'Personaje 1' : 'Personaje 2'}
        </h2>
      </div>

      {/* Search Input */}
      <div className="p-4 pt-3 border-b flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {/* Resultado counter */}
        {!isLoading && !error && (
          <p className="text-xs text-muted-foreground mt-2">
            {searchQuery ? (
              <>
                {characters.length === 0 ? (
                  <span>No hay resultados para &quot;{searchQuery}&quot;</span>
                ) : (
                  <span>{characters.length} resultado{characters.length !== 1 ? 's' : ''} encontrado{characters.length !== 1 ? 's' : ''}</span>
                )}
              </>
            ) : (
              <span>Mostrando los primeros resultados</span>
            )}
          </p>
        )}
      </div>

      {/* Characters Grid */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4">{/* Loading State */}
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

          {/* Error State */}
          {error && (
            <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md text-sm">
              Error cargando personajes
            </div>
          )}

          {/* Empty State - Búsqueda sin resultados */}
          {!isLoading && !error && characters.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">
                No encontramos &quot;{searchQuery}&quot;
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Intenta con otro nombre
              </p>
            </div>
          )}

          {/* Empty State - Sin búsqueda, lista vacía */}
          {!isLoading && !error && characters.length === 0 && !searchQuery && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">
                No hay personajes disponibles
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Intenta buscando por nombre
              </p>
            </div>
          )}

          {/* Characters Grid */}
          <div className="grid grid-cols-2 gap-3">
            {characters.map((character: Character) => (
              <Card
                key={character.id}
                onClick={() => setSelected(character)}
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedChar?.id === character.id
                    ? 'ring-2 ring-primary'
                    : 'hover:shadow-lg'
                }`}
              >
                {/* Avatar - Prominente */}
                <div className="relative h-32 overflow-hidden bg-muted flex items-center justify-center">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* Info - Compacta abajo */}
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
        </div>
      </ScrollArea>
    </div>
  );
}
