import { useState, useEffect, useRef, useCallback } from 'react';

export function useCarousel(itemCount: number, resetDependency?: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 5) {
      setScrollProgress(0);
      if (progressBarRef.current) {
        progressBarRef.current.style.left = '0px';
      }
      setActiveIndex(0);
      setIsAtStart(true);
      setIsAtEnd(true);
      return;
    }

    const currentScroll = el.scrollLeft;
    setIsAtStart(currentScroll <= 10);
    setIsAtEnd(currentScroll >= maxScroll - 10);

    const progress = Math.min(95, Math.max(0, (currentScroll / maxScroll) * 95));
    setScrollProgress(progress);
    if (progressBarRef.current) {
      progressBarRef.current.style.left = `${progress}px`;
    }

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length > 0) {
      if (currentScroll <= 10) {
        setActiveIndex(0);
      } else if (currentScroll >= maxScroll - 10) {
        setActiveIndex(children.length - 1);
      } else {
        const containerCenter = currentScroll + el.clientWidth / 2;
        let closestIndex = 0;
        let minDistance = Infinity;
        children.forEach((child, index) => {
          const childCenter = child.offsetLeft + child.clientWidth / 2;
          const distance = Math.abs(childCenter - containerCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });
        setActiveIndex(closestIndex);
      }
    }
  }, []);

  const scrollNext = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;

    const currentScroll = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    // Find first child whose offsetLeft is at least 30px past the current scroll position
    const target = children.find(child => child.offsetLeft > currentScroll + 30);

    if (target) {
      el.scrollTo({
        left: Math.min(target.offsetLeft, maxScroll),
        behavior: 'smooth'
      });
    } else {
      el.scrollTo({
        left: maxScroll,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollPrev = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;

    const currentScroll = el.scrollLeft;
    // Find children whose offsetLeft is at least 30px before current scroll position
    const prevChildren = children.filter(child => child.offsetLeft < currentScroll - 30);

    if (prevChildren.length > 0) {
      const target = prevChildren[prevChildren.length - 1];
      el.scrollTo({
        left: Math.max(0, target.offsetLeft),
        behavior: 'smooth'
      });
    } else {
      el.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // Reset scroll on dependency change (e.g., category switch)
  useEffect(() => {
    if (resetDependency !== undefined && containerRef.current) {
      containerRef.current.scrollLeft = 0;
      setScrollProgress(0);
      setActiveIndex(0);
      setIsAtStart(true);
      setIsAtEnd(itemCount <= 1);
    }
  }, [resetDependency, itemCount]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });

      handleScroll();

      const timer1 = setTimeout(handleScroll, 100);
      const timer2 = setTimeout(handleScroll, 500);
      const timer3 = setTimeout(handleScroll, 1000);

      return () => {
        el.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [handleScroll, resetDependency, itemCount]);

  return {
    containerRef,
    progressBarRef,
    scrollProgress,
    activeIndex,
    scrollPrev,
    scrollNext,
    handleScroll,
    isAtStart,
    isAtEnd,
  };
}

