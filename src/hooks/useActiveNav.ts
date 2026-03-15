"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const GLOW_LINE_WIDTH = 259;

/**
 * Hook to manage the active navigation index and the animated glow line position.
 */
export function useActiveNav() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [glowLineX, setGlowLineX] = useState(0);
  
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const updatePosition = useCallback(() => {
    if (navRef.current && linkRefs.current[activeIndex]) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = linkRefs.current[activeIndex]!.getBoundingClientRect();
      
      const linkCenter = linkRect.left + linkRect.width / 2;
      const x = linkCenter - navRect.left - (GLOW_LINE_WIDTH / 2) - 25;
      
      setGlowLineX(x);
    }
  }, [activeIndex]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  return {
    activeIndex,
    setActiveIndex,
    glowLineX,
    navRef,
    linkRefs,
  };
}
