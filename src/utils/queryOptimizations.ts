// React Query Performance Optimizations
// This file contains optimizations for RTK Query and React Query

import { QueryClient } from '@reduxjs/toolkit/query';

/**
 * Optimized Query Client configuration
 */
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Reduce unnecessary refetches
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMountOrArgChange: false,
        
        // Optimize caching
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
        
        // Retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        
        // Optimize network requests
        networkMode: 'online',
        
        // Batch updates
        structuralSharing: true,
      },
      mutations: {
        // Optimize mutation retries
        retry: 1,
        
        // Optimize network mode
        networkMode: 'online',
      },
    },
  });
};

/**
 * Query optimization options for common use cases
 */
export const queryOptions = {
  // For data that rarely changes
  static: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour
    refetchOnMountOrArgChange: false,
    refetchOnWindowFocus: false,
  },
  
  // For frequently changing data
  dynamic: {
    staleTime: 30 * 1000,      // 30 seconds
    gcTime: 5 * 60 * 1000,     // 5 minutes
    refetchOnMountOrArgChange: true,
    refetchOnWindowFocus: true,
  },
  
  // For real-time data
  realtime: {
    staleTime: 0,               // Always stale
    gcTime: 1 * 60 * 1000,     // 1 minute
    refetchOnMountOrArgChange: true,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,      // Refetch every 5 seconds
  },
  
  // For user preferences/settings
  user: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnMountOrArgChange: false,
    refetchOnWindowFocus: false,
  },
};

/**
 * Optimized query hooks with better performance
 */
export const createOptimizedQueryHook = <T>(
  queryFn: () => Promise<T>,
  options: any = {}
) => {
  return {
    queryFn,
    ...queryOptions.static, // Default to static optimization
    ...options,
  };
};

/**
 * Batch query invalidation for better performance
 */
export const batchInvalidateQueries = (
  queryClient: QueryClient,
  queries: Array<{ queryKey: any[]; exact?: boolean }>
) => {
  // Group queries by their first key for batch invalidation
  const groupedQueries = queries.reduce((acc, query) => {
    const firstKey = query.queryKey[0];
    if (!acc[firstKey]) {
      acc[firstKey] = [];
    }
    acc[firstKey].push(query);
    return acc;
  }, {} as Record<string, typeof queries>);

  // Invalidate each group
  Object.values(groupedQueries).forEach(group => {
    queryClient.invalidateQueries({
      queries: group,
    });
  });
};

/**
 * Optimized mutation with better error handling
 */
export const createOptimizedMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: any = {}
) => {
  return {
    mutationFn,
    // Optimize retry logic
    retry: (failureCount: number, error: any) => {
      // Don't retry on validation errors
      if (error?.status === 400 || error?.status === 422) {
        return false;
      }
      // Retry network errors up to 2 times
      return failureCount < 2 && (error?.status >= 500 || error?.status === 0);
    },
    // Optimize network mode
    networkMode: 'online',
    ...options,
  };
};

/**
 * Query deduplication for identical requests
 */
export const createDeduplicatedQuery = <T>(
  queryFn: () => Promise<T>,
  dedupeTime: number = 1000 // 1 second
) => {
  let lastCall = 0;
  let lastResult: Promise<T> | null = null;

  return async () => {
    const now = Date.now();
    
    if (now - lastCall < dedupeTime && lastResult) {
      return lastResult;
    }
    
    lastCall = now;
    lastResult = queryFn();
    return lastResult;
  };
};

/**
 * Optimized infinite query configuration
 */
export const infiniteQueryOptions = {
  // For paginated lists
  pagination: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnMountOrArgChange: false,
    refetchOnWindowFocus: false,
    
    // Optimize page merging
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      return lastPage.nextCursor || undefined;
    },
    
    // Optimize page caching
    select: (data: any) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      // Flatten pages for easier access
      items: data.pages.flatMap((page: any) => page.items || []),
    }),
  },
};

/**
 * Query prefetching for better UX
 */
export const prefetchQueries = async (
  queryClient: QueryClient,
  queries: Array<{ queryKey: any[]; queryFn: () => Promise<any> }>
) => {
  const prefetchPromises = queries.map(({ queryKey, queryFn }) =>
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  );

  await Promise.all(prefetchPromises);
};

/**
 * Optimized query result selector
 */
export const createQuerySelector = <T, R>(
  selector: (data: T) => R,
  defaultValue: R
) => {
  return (data: T | undefined): R => {
    if (!data) return defaultValue;
    try {
      return selector(data);
    } catch (error) {
      console.warn('Query selector error:', error);
      return defaultValue;
    }
  };
};

/**
 * Query result transformation with memoization
 */
export const transformQueryResult = <T, R>(
  data: T | undefined,
  transformer: (data: T) => R,
  defaultValue: R
): R => {
  if (!data) return defaultValue;
  
  try {
    return transformer(data);
  } catch (error) {
    console.warn('Query result transformation error:', error);
    return defaultValue;
  }
};

/**
 * Optimized query subscription management
 */
export const createQuerySubscription = <T>(
  queryClient: QueryClient,
  queryKey: any[],
  callback: (data: T) => void
) => {
  const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'updated' && event.query.queryHash === queryClient.getQueryCache().build(queryKey).queryHash) {
      const data = event.query.state.data as T;
      if (data) {
        callback(data);
      }
    }
  });

  return unsubscribe;
};

/**
 * Query performance monitoring
 */
export const monitorQueryPerformance = (
  queryClient: QueryClient,
  queryKey: any[]
) => {
  const query = queryClient.getQueryCache().get(queryKey);
  
  if (query) {
    const { dataUpdateCount, stateUpdateCount, fetchCount } = query;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Query Performance] ${queryKey.join('/')}:`, {
        dataUpdates: dataUpdateCount,
        stateUpdates: stateUpdateCount,
        fetches: fetchCount,
        isStale: query.isStale(),
        isFetching: query.state.isFetching,
      });
    }
    
    return {
      dataUpdateCount,
      stateUpdateCount,
      fetchCount,
      isStale: query.isStale(),
      isFetching: query.state.isFetching,
    };
  }
  
  return null;
};
