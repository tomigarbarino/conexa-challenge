'use client';

export function Header() {
  return (
    <header className="h-12 sm:h-14 flex-shrink-0 border-b flex items-center px-3 sm:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <h1 className="text-lg sm:text-2xl font-bold truncate">Rick & Morty Comparator</h1>
    </header>
  );
}
