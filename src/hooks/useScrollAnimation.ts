'use client';

import { useEffect, useRef } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          if (once) observer.disconnect();
        } else if (!once) {
          el.classList.remove('is-visible');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

export function useStaggeredAnimation(count: number, options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = options;
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const children = Array.from(container.children) as HTMLElement[];
          children.forEach((child, i) => {
            setTimeout(() => {
              child.classList.add('is-visible');
            }, i * 120);
          });
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [count, threshold, rootMargin]);

  return containerRef;
}
