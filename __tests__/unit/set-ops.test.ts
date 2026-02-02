import { describe, it, expect } from 'vitest';
import { intersection, difference, union } from '@/features/episodes/utils/set-ops';

describe('Set Operations', () => {
  describe('intersection', () => {
    it('should return common elements between two arrays', () => {
      const result = intersection([1, 2, 3, 4], [3, 4, 5, 6]);
      expect(result).toEqual([3, 4]);
    });

    it('should return empty array when no common elements', () => {
      const result = intersection([1, 2, 3], [4, 5, 6]);
      expect(result).toEqual([]);
    });

    it('should return empty array when first array is empty', () => {
      const result = intersection([], [1, 2, 3]);
      expect(result).toEqual([]);
    });

    it('should return empty array when second array is empty', () => {
      const result = intersection([1, 2, 3], []);
      expect(result).toEqual([]);
    });

    it('should return all elements when arrays are identical', () => {
      const result = intersection([1, 2, 3], [1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should work with string arrays', () => {
      const result = intersection(['a', 'b', 'c'], ['b', 'c', 'd']);
      expect(result).toEqual(['b', 'c']);
    });
  });

  describe('difference', () => {
    it('should return elements in first array not in second', () => {
      const result = difference([1, 2, 3, 4], [3, 4, 5, 6]);
      expect(result).toEqual([1, 2]);
    });

    it('should return all elements when no overlap', () => {
      const result = difference([1, 2, 3], [4, 5, 6]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty array when first array is empty', () => {
      const result = difference([], [1, 2, 3]);
      expect(result).toEqual([]);
    });

    it('should return all elements when second array is empty', () => {
      const result = difference([1, 2, 3], []);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty array when arrays are identical', () => {
      const result = difference([1, 2, 3], [1, 2, 3]);
      expect(result).toEqual([]);
    });

    it('should work with string arrays', () => {
      const result = difference(['a', 'b', 'c'], ['b', 'c', 'd']);
      expect(result).toEqual(['a']);
    });
  });

  describe('union', () => {
    it('should return all unique elements from both arrays', () => {
      const result = union([1, 2, 3], [3, 4, 5]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return first array when second is empty', () => {
      const result = union([1, 2, 3], []);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return second array when first is empty', () => {
      const result = union([], [1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should remove duplicates from identical arrays', () => {
      const result = union([1, 2, 3], [1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle arrays with no overlap', () => {
      const result = union([1, 2], [3, 4]);
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });
});
