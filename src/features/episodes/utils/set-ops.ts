export function intersection<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return a.filter(item => setB.has(item));
}

export function difference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return a.filter(item => !setB.has(item));
}

export function union<T>(a: T[], b: T[]): T[] {
  return Array.from(new Set([...a, ...b]));
}
