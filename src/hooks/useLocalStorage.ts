// src/hooks/useLocalStorage.ts
"use client";

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item) as T);
      } else {
        // If no item in localStorage, set the initialValue there
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        // No need to setStoredValue here as it's already `initialValue` from useState
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      // If error reading, set initialValue in localStorage
      window.localStorage.setItem(key, JSON.stringify(initialValue));
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === "undefined") {
        console.warn(`Tried to set localStorage key "${key}" but window is not defined.`);
        // Update state optimistically even if localStorage fails or window is undefined server-side
        // This might be desired depending on SSR strategy, or removed if state should only change with localStorage success
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        return;
      }
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
