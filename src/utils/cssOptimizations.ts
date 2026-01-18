// CSS Performance Optimizations
// This file contains utilities to optimize CSS and rendering performance

/**
 * CSS Performance Optimization Utilities
 */

// Debounced scroll handler for better performance
export const createDebouncedScrollHandler = (
  callback: (scrollTop: number) => void,
  delay: number = 16 // One frame at 60fps
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (scrollTop: number) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(scrollTop), delay);
  };
};

// Optimized resize observer
export const createOptimizedResizeObserver = (
  callback: (entries: ResizeObserverEntry[]) => void,
  options: ResizeObserverOptions = {}
) => {
  let rafId: number;
  
  const debouncedCallback = (entries: ResizeObserverEntry[]) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => callback(entries));
  };
  
  return new ResizeObserver(debouncedCallback);
};

// CSS containment for better performance
export const cssContainment = {
  layout: 'layout',
  style: 'style',
  paint: 'paint',
  size: 'size',
  strict: 'strict',
  content: 'content',
} as const;

// Optimized CSS classes for performance
export const performanceClasses = {
  // Hardware acceleration
  gpu: 'transform-gpu will-change-transform',
  
  // Smooth transitions
  smooth: 'transition-all duration-200 ease-in-out',
  
  // Optimized animations
  optimized: 'transform-gpu will-change-transform transition-transform duration-200',
  
  // Reduced motion for accessibility
  reducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
  
  // High performance scrolling
  scrollOptimized: 'overflow-auto overscroll-contain scroll-smooth',
  
  // Optimized rendering
  renderOptimized: 'backface-visibility-hidden perspective-1000',
} as const;

// CSS custom properties for performance
export const cssVariables = {
  // Animation durations
  '--duration-fast': '150ms',
  '--duration-normal': '300ms',
  '--duration-slow': '500ms',
  
  // Easing functions
  '--ease-linear': 'linear',
  '--ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  '--ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  '--ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Z-index layers
  '--z-dropdown': '1000',
  '--z-sticky': '1020',
  '--z-fixed': '1030',
  '--z-modal-backdrop': '1040',
  '--z-modal': '1050',
  '--z-popover': '1060',
  '--z-tooltip': '1070',
} as const;

// Apply CSS variables to document
export const applyCSSVariables = (variables: Record<string, string>) => {
  const root = document.documentElement;
  
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

// Optimized class merging
export const mergeClasses = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Performance-focused class utilities
export const createPerformanceClasses = (baseClasses: string, performanceLevel: 'low' | 'medium' | 'high' = 'medium') => {
  const performanceMap = {
    low: '',
    medium: 'transform-gpu',
    high: 'transform-gpu will-change-transform backface-visibility-hidden',
  };
  
  return mergeClasses(baseClasses, performanceMap[performanceLevel]);
};

// CSS-in-JS optimization
export const createOptimizedStyles = (styles: Record<string, any>) => {
  // Convert to CSS custom properties for better performance
  const cssProperties = Object.entries(styles).map(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `${cssKey}: ${value};`;
  }).join(' ');
  
  return cssProperties;
};

// Intersection Observer for lazy loading
export const createLazyLoadObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Optimized event listeners
export const createOptimizedEventListener = (
  element: EventTarget,
  event: string,
  handler: EventListener,
  options: AddEventListenerOptions = {}
) => {
  const optimizedOptions: AddEventListenerOptions = {
    passive: true, // Better scrolling performance
    capture: false,
    ...options,
  };
  
  element.addEventListener(event, handler, optimizedOptions);
  
  return () => {
    element.removeEventListener(event, handler, optimizedOptions);
  };
};

// CSS animation performance monitoring
export const monitorAnimationPerformance = (element: Element) => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
      
      if (entry.entryType === 'first-input') {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
      
      if (entry.entryType === 'layout-shift') {
        console.log('CLS:', entry.value);
      }
    });
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  
  return observer;
};

// Optimized DOM manipulation
export const batchDOMUpdates = (updates: (() => void)[]) => {
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    // Batch all updates in one frame
    updates.forEach(update => update());
  });
};

// CSS containment for better performance
export const applyCSSContainment = (element: HTMLElement, containment: keyof typeof cssContainment) => {
  element.style.contain = cssContainment[containment];
};

// Optimized scroll handling
export const createOptimizedScrollHandler = (
  container: HTMLElement,
  callback: (scrollTop: number) => void
) => {
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback(container.scrollTop);
        ticking = false;
      });
      ticking = true;
    }
  };
  
  container.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    container.removeEventListener('scroll', handleScroll);
  };
};

// CSS performance utilities
export const cssPerformance = {
  // Apply hardware acceleration
  enableGPU: (element: HTMLElement) => {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
  },
  
  // Disable hardware acceleration
  disableGPU: (element: HTMLElement) => {
    element.style.transform = '';
    element.style.willChange = '';
  },
  
  // Optimize for animations
  optimizeForAnimation: (element: HTMLElement) => {
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
  },
  
  // Reset optimizations
  resetOptimizations: (element: HTMLElement) => {
    element.style.willChange = '';
    element.style.backfaceVisibility = '';
    element.style.perspective = '';
    element.style.transform = '';
  },
};

// Performance monitoring utilities
export const performanceUtils = {
  // Measure function execution time
  measure: <T>(name: string, fn: () => T): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  },
  
  // Measure async function execution time
  measureAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  },
  
  // Get memory usage
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
        total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
        limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100,
      };
    }
    return null;
  },
};
