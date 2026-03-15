"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hook to cycle through a list of words at a given interval.
 */
export function useCyclingWord(words: readonly string[], intervalMs: number) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, words.length, intervalMs]);

  return {
    index,
    currentWord: words[index],
  };
}
