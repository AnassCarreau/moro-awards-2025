// Cache en memoria para el servidor
const cache = new Map<string, { data: any; timestamp: number }>();

export function getCached<T>(key: string, ttlSeconds: number): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > ttlSeconds * 1000;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(keyPattern?: string): void {
  if (!keyPattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key);
    }
  }
}
