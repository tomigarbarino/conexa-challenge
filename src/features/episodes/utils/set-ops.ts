/**
 * Operaciones de conjuntos para arrays de IDs
 * Optimizado para comparación de episodios
 */

/**
 * Retorna elementos que están en ambos arrays (A ∩ B)
 */
export function intersection<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return a.filter(item => setB.has(item));
}

/**
 * Retorna elementos que están en A pero no en B (A - B)
 */
export function difference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return a.filter(item => !setB.has(item));
}

/**
 * Retorna todos los elementos únicos de ambos arrays (A ∪ B)
 */
export function union<T>(a: T[], b: T[]): T[] {
  return Array.from(new Set([...a, ...b]));
}
