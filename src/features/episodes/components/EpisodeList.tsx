'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Film, Calendar, ChevronsDown } from 'lucide-react';
import { Episode } from '@/schemas/episode';

interface EpisodeListProps {
  title: string;
  episodes: Episode[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function EpisodeList({ 
  title, 
  episodes, 
  isLoading = false,
  emptyMessage = 'No hay episodios',
  emptyIcon
}: EpisodeListProps) {
  const hasMoreContent = episodes.length > 3;

  return (
    <div className="relative h-full w-full">
      <ScrollArea className="h-full w-full">
        <div className="p-4">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm py-3 border-b mb-4 z-10">
            <h3 className="text-sm font-bold">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? (
                <span className="inline-flex items-center gap-1">
                  <span className="animate-pulse">●</span> Cargando...
                </span>
              ) : (
                <span>{episodes.length} episodio{episodes.length !== 1 ? 's' : ''}</span>
              )}
            </p>
          </div>

        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 border-b">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && episodes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            {emptyIcon || <Film className="h-12 w-12 text-muted-foreground/30 mb-3" />}
            <p className="text-sm text-muted-foreground font-medium">
              {emptyMessage}
            </p>
          </div>
        )}

        {!isLoading && episodes.length > 0 && (
          <div className="space-y-1">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="group p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight mb-1 group-hover:text-primary transition-colors truncate" title={episode.name}>
                      {episode.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{episode.air_date}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono flex-shrink-0">
                    {episode.episode}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </ScrollArea>
      
      {hasMoreContent && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none">
          <div className="h-10 w-full bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute bottom-1 bg-black text-white rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] shadow-md">
            <ChevronsDown className="h-3 w-3" />
            <span>Scroll</span>
          </div>
        </div>
      )}
    </div>
  );
}
