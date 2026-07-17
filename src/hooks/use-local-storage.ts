"use client";

import * as React from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable (private browsing, quota exceeded) — value stays in-memory only
    }
  }, [key, value]);

  return [value, setValue] as const;
}
