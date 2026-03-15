"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: string;
  threshold?: number;
  className?: string;
}

/**
 * A highly reusable, performant reveal-on-scroll component.
 * Uses IntersectionObserver to trigger CSS-based animations.
 */
export const Reveal = ({ 
  children, 
  delay = "0ms", 
  threshold = 0.1, 
  className = "" 
}: RevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`${isVisible ? "animate-fade-up" : "opacity-0"} ${className}`}
      style={{ "--animation-delay": delay } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
