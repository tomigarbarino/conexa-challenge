'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Episode } from '@/schemas/episode';

interface EpisodeListProps {
  title: string;
  episodes: Episode[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function EpisodeList({ 
  title, 
  episodes, 
  isLoading = false,
  emptyMessage = 'No hay episodios'
}: EpisodeListProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 space-y-3">
        <div className="sticky top-0 bg-background/95 backdrop-blur py-2 border-b mb-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? 'Cargando...' : `${episodes.length} episodio${episodes.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </Card>
            ))}
          </>
        )}

        {/* Empty State */}
        {!isLoading && episodes.length === 0 && (
          <div className="p-6 text-center text-muted-foreground text-sm">
            {emptyMessage}
          </div>
        )}

        {/* Episode Cards */}
        {!isLoading && episodes.map((episode) => (
          <Card
            key={episode.id}
            className="p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm leading-tight">{episode.name}</h4>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {episode.episode}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {episode.air_date}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
