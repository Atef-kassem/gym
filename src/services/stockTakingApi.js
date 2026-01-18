import { apiSlice } from './apiSlice';

const STOCK_TAKING_URL = '/stock-taking';

export const stockTakingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Stock Count Session APIs
    getAllSessions: builder.query({
      query: () => `${STOCK_TAKING_URL}/sessions`,
      providesTags: ['StockTaking']
    }),
    
    createSession: builder.mutation({
      query: (sessionData) => ({
        url: `${STOCK_TAKING_URL}/sessions`,
        method: 'POST',
        body: sessionData,
      }),
      invalidatesTags: ['StockTaking']
    }),
    
    getSession: builder.query({
      query: (id) => `${STOCK_TAKING_URL}/sessions/${id}`,
      providesTags: ['StockTaking']
    }),
    
    updateSession: builder.mutation({
      query: ({ id, sessionData }) => ({
        url: `${STOCK_TAKING_URL}/sessions/${id}`,
        method: 'PATCH',
        body: sessionData,
      }),
      invalidatesTags: ['StockTaking']
    }),
    
    deleteSession: builder.mutation({
      query: (id) => ({
        url: `${STOCK_TAKING_URL}/sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StockTaking']
    }),
    
    // Count Item APIs
    getAllCountItems: builder.query({
      query: (sessionId) => `${STOCK_TAKING_URL}/sessions/${sessionId}/items`,
      providesTags: ['CountItems']
    }),
    
    getAllCountItemsFromAllSessions: builder.query({
      query: () => `${STOCK_TAKING_URL}/items/all`,
      providesTags: ['CountItems']
    }),
    
    createCountItem: builder.mutation({
      query: ({ sessionId, itemData }) => ({
        url: `${STOCK_TAKING_URL}/sessions/${sessionId}/items`,
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: ['CountItems']
    }),
    
    createBulkCountItems: builder.mutation({
      query: ({ sessionId, itemsData }) => ({
        url: `${STOCK_TAKING_URL}/sessions/${sessionId}/items/bulk`,
        method: 'POST',
        body: itemsData,
      }),
      invalidatesTags: ['CountItems']
    }),
    
    getCountItem: builder.query({
      query: (id) => `${STOCK_TAKING_URL}/items/${id}`,
      providesTags: ['CountItems']
    }),
    
    updateCountItem: builder.mutation({
      query: ({ id, itemData }) => ({
        url: `${STOCK_TAKING_URL}/items/${id}`,
        method: 'PATCH',
        body: itemData,
      }),
      invalidatesTags: ['CountItems']
    }),
    
    deleteCountItem: builder.mutation({
      query: (id) => ({
        url: `${STOCK_TAKING_URL}/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CountItems']
    }),
    
    // Adjustment APIs
    getAllAdjustments: builder.query({
      query: () => `${STOCK_TAKING_URL}/adjustments`,
      providesTags: ['Adjustments']
    }),
    
    createAdjustment: builder.mutation({
      query: (adjustmentData) => ({
        url: `${STOCK_TAKING_URL}/adjustments`,
        method: 'POST',
        body: adjustmentData,
      }),
      invalidatesTags: ['Adjustments']
    }),
    
    getAdjustment: builder.query({
      query: (id) => `${STOCK_TAKING_URL}/adjustments/${id}`,
      providesTags: ['Adjustments']
    }),
    
    updateAdjustment: builder.mutation({
      query: ({ id, adjustmentData }) => ({
        url: `${STOCK_TAKING_URL}/adjustments/${id}`,
        method: 'PATCH',
        body: adjustmentData,
      }),
      invalidatesTags: ['Adjustments']
    }),
    
    deleteAdjustment: builder.mutation({
      query: (id) => ({
        url: `${STOCK_TAKING_URL}/adjustments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Adjustments']
    }),
    
    approveAdjustment: builder.mutation({
      query: (id) => ({
        url: `${STOCK_TAKING_URL}/adjustments/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Adjustments']
    }),
    
    // Statistics APIs
    getStatistics: builder.query({
      query: () => `${STOCK_TAKING_URL}/statistics`,
      providesTags: ['Statistics']
    }),
    
    getSessionStatistics: builder.query({
      query: (sessionId) => `${STOCK_TAKING_URL}/sessions/${sessionId}/statistics`,
      providesTags: ['Statistics']
    }),
  }),
});

export const {
  useGetAllSessionsQuery,
  useCreateSessionMutation,
  useGetSessionQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useGetAllCountItemsQuery,
  useGetAllCountItemsFromAllSessionsQuery,
  useCreateCountItemMutation,
  useCreateBulkCountItemsMutation,
  useGetCountItemQuery,
  useUpdateCountItemMutation,
  useDeleteCountItemMutation,
  useGetAllAdjustmentsQuery,
  useCreateAdjustmentMutation,
  useGetAdjustmentQuery,
  useUpdateAdjustmentMutation,
  useDeleteAdjustmentMutation,
  useApproveAdjustmentMutation,
  useGetStatisticsQuery,
  useGetSessionStatisticsQuery,
} = stockTakingApi;
