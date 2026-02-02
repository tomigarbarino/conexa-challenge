'use client';

import { useEffect } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useComparisonStore } from '@/store/comparison.store';
import { CharacterSchema } from '@/schemas/character';

async function fetchCharacterById(id: number) {
  const response = await axiosInstance.get(`/character/${id}`);
  return CharacterSchema.parse(response.data);
}

export function useUrlSync() {
  const [charAId, setCharAId] = useQueryState('charA', parseAsInteger);
  const [charBId, setCharBId] = useQueryState('charB', parseAsInteger);

  const selectedCharA = useComparisonStore(state => state.selectedCharA);
  const selectedCharB = useComparisonStore(state => state.selectedCharB);
  const setSelectedCharA = useComparisonStore(state => state.setSelectedCharA);
  const setSelectedCharB = useComparisonStore(state => state.setSelectedCharB);

  const { data: charAFromUrl } = useQuery({
    queryKey: ['character', charAId],
    queryFn: () => fetchCharacterById(charAId!),
    enabled: !!charAId && !selectedCharA,
    staleTime: 1000 * 60 * 10,
  });

  const { data: charBFromUrl } = useQuery({
    queryKey: ['character', charBId],
    queryFn: () => fetchCharacterById(charBId!),
    enabled: !!charBId && !selectedCharB,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (charAFromUrl && !selectedCharA) {
      setSelectedCharA(charAFromUrl);
    }
  }, [charAFromUrl, selectedCharA, setSelectedCharA]);

  useEffect(() => {
    if (charBFromUrl && !selectedCharB) {
      setSelectedCharB(charBFromUrl);
    }
  }, [charBFromUrl, selectedCharB, setSelectedCharB]);

  useEffect(() => {
    if (selectedCharA) {
      setCharAId(selectedCharA.id);
    } else {
      setCharAId(null);
    }
  }, [selectedCharA, setCharAId]);

  useEffect(() => {
    if (selectedCharB) {
      setCharBId(selectedCharB.id);
    } else {
      setCharBId(null);
    }
  }, [selectedCharB, setCharBId]);

  return { charAId, charBId };
}
