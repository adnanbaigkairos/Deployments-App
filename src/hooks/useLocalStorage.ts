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
        // If item exists in localStorage, update our state with it.
        // React's setState will bail out if the new value is === to the old one.
        // For objects/arrays, JSON.parse creates a new reference, so this will update if the content differs
        // or if storedValue was the initialValue reference.
        setStoredValue(JSON.parse(item) as T);
      } else {
        // If no item in localStorage, set the initialValue there.
        // The state `storedValue` is already `initialValue` from useState.
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.error(`Error reading/setting localStorage key "${key}":`, error);
      // Fallback: if reading or parsing fails, ensure initialValue is in localStorage.
      // This might happen if localStorage contains malformed data for the key.
      try {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      } catch (writeError) {
        // Log secondary error if fallback write also fails
        console.error(`Error setting localStorage key "${key}" after a read/parse error:`, writeError);
      }
    }
  }, [key]); // Dependency: only 'key'. 'initialValue' is captured from the first render's closure.

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
    [key, storedValue] // storedValue is needed here because `value(storedValue)` uses it.
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
