import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = "0px 0px -60px 0px", once = true } = options;
  const ref = useRef<T | null>(null);
  // framer-motion useInView accepts amount (threshold) and margin
  const inView = useInView(ref, {
    amount: threshold,
    margin: rootMargin as `${number}px ${number}px ${number}px ${number}px`,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (inView) {
        setIsVisible(true);
      } else if (!once) {
        setIsVisible(false);
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [inView, once]);

  return { ref, isVisible } as const;
}
