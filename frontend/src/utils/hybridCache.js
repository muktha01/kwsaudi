// Hybrid cache utility: uses memory (for SSR) and localStorage (for browser)
// Usage: cache.get(key), cache.set(key, value, ttlMs)

const isBrowser = typeof window !== 'undefined';
const memoryCache = new Map();

function now() {
  return Date.now();
}

function getFromLocalStorage(key) {
  if (!isBrowser) return undefined;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return undefined;
    const { value, expires } = JSON.parse(item);
    if (expires && expires < now()) {
      window.localStorage.removeItem(key);
      return undefined;
    }
    return value;
  } catch {
    return undefined;
  }
}

function setToLocalStorage(key, value, ttlMs) {
  if (!isBrowser) return;
  const expires = ttlMs ? now() + ttlMs : null;
  window.localStorage.setItem(key, JSON.stringify({ value, expires }));
}

export const cache = {
  get(key) {
    // Check memory first
    if (memoryCache.has(key)) {
      const { value, expires } = memoryCache.get(key);
      if (!expires || expires > now()) return value;
      memoryCache.delete(key);
    }
    // Check localStorage
    return getFromLocalStorage(key);
  },
  set(key, value, ttlMs) {
    const expires = ttlMs ? now() + ttlMs : null;
    memoryCache.set(key, { value, expires });
    setToLocalStorage(key, value, ttlMs);
  },
  clear(key) {
    memoryCache.delete(key);
    if (isBrowser) window.localStorage.removeItem(key);
  }
};
