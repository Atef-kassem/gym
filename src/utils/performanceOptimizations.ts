// Performance Optimization Utilities
// This file contains utilities to improve React app performance

import { useCallback, useMemo, useRef } from 'react';

/**
 * Debounce hook to limit function execution frequency
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  ) as T;
}

/**
 * Throttle hook to limit function execution rate
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef(0);
  const lastCallTimer = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCall.current >= delay) {
        callback(...args);
        lastCall.current = now;
      } else {
        if (lastCallTimer.current) {
          clearTimeout(lastCallTimer.current);
        }
        lastCallTimer.current = setTimeout(() => {
          callback(...args);
          lastCall.current = Date.now();
        }, delay - (now - lastCall.current));
      }
    },
    [callback, delay]
  ) as T;
}

/**
 * Memoized search function for better performance
 */
export function useMemoizedSearch<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  filterFn?: (item: T) => boolean
) {
  return useMemo(() => {
    if (!searchTerm && !filterFn) return items;

    return items.filter((item) => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const hasMatch = searchFields.some((field) => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          return false;
        });
        if (!hasMatch) return false;
      }

      // Apply custom filter
      if (filterFn && !filterFn(item)) return false;

      return true;
    });
  }, [items, searchTerm, searchFields, filterFn]);
}

/**
 * Virtual scrolling helper for large lists
 */
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = start + visibleCount + overscan;

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end)
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange.start, visibleRange.end]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return { ref: setRef, isIntersecting };
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] Render #${renderCount.current} in ${timeSinceLastRender.toFixed(2)}ms`);
    }
    
    lastRenderTime.current = now;
  });

  return { renderCount: renderCount.current };
}

/**
 * Batch state updates for better performance
 */
export function useBatchState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const batchRef = useRef<Partial<T>>({});
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((updates: Partial<T>) => {
    Object.assign(batchRef.current, updates);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, ...batchRef.current }));
      batchRef.current = {};
    }, 16); // One frame at 60fps
  }, []);

  return [state, batchUpdate] as const;
}

/**
 * Optimized list rendering with windowing
 */
export function useWindowing<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 2, items.length);

    return {
      items: items.slice(startIndex, endIndex),
      startIndex,
      endIndex
    };
  }, [items, scrollTop, itemHeight, containerHeight]);

  const containerStyle = useMemo(() => ({
    height: items.length * itemHeight,
    position: 'relative' as const
  }), [items.length, itemHeight]);

  const listStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: visibleItems.startIndex * itemHeight,
    left: 0,
    right: 0
  }), [visibleItems.startIndex, itemHeight]);

  return {
    visibleItems: visibleItems.items,
    containerStyle,
    listStyle,
    setScrollTop
  };
}

// Import useState and useEffect for the hooks above
import { useState, useEffect } from 'react';
