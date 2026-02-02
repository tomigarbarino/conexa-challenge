import { create } from 'zustand';
import { Character } from '@/schemas/character';

interface ComparisonStore {
  selectedCharA: Character | null;
  selectedCharB: Character | null;
  setSelectedCharA: (character: Character | null) => void;
  setSelectedCharB: (character: Character | null) => void;
  clear: () => void;
}

export const useComparisonStore = create<ComparisonStore>((set) => ({
  selectedCharA: null,
  selectedCharB: null,
  setSelectedCharA: (character) => set({ selectedCharA: character }),
  setSelectedCharB: (character) => set({ selectedCharB: character }),
  clear: () => set({ selectedCharA: null, selectedCharB: null }),
}));
