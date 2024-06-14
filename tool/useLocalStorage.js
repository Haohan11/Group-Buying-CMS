import { useState } from "react";

export default function useLocalStorage(key, defaultValue) {
    const [value] = useState(() => {
      let currentValue;
  
      try {
        currentValue = JSON.parse(
          localStorage.getItem(key) || String(defaultValue)
        );
      } catch {
        currentValue = defaultValue;
      }
  
      return currentValue;
    });
  
    const set = (v) => localStorage.setItem(key, JSON.stringify(v));
    const clear = () => localStorage.removeItem(key);
  
    return [value, set, clear];
  }