import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quickPurchaseOrdersApi = createApi({
  reducerPath: 'quickPurchaseOrdersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://metagym.metacodecx.com/api/v1/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['QuickPurchaseOrder'],
  endpoints: (builder) => ({
    getQuickPurchaseOrders: builder.query({
      query: (params) => ({
        url: 'quick-purchase-orders',
        params,
      }),
      providesTags: ['QuickPurchaseOrder'],
    }),

    getQuickPurchaseOrder: builder.query({
      query: (id) => `quick-purchase-orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'QuickPurchaseOrder', id }],
    }),

    createQuickPurchaseOrder: builder.mutation({
      query: (order) => ({
        url: 'quick-purchase-orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['QuickPurchaseOrder'],
    }),

    updateQuickPurchaseOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `quick-purchase-orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'QuickPurchaseOrder', id },
        'QuickPurchaseOrder',
      ],
    }),

    deleteQuickPurchaseOrder: builder.mutation({
      query: (id) => ({
        url: `quick-purchase-orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['QuickPurchaseOrder'],
    }),

    changeQuickPurchaseOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `quick-purchase-orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'QuickPurchaseOrder', id },
        'QuickPurchaseOrder',
      ],
    }),

    getQuickPurchaseOrderStatistics: builder.query({
      query: (params) => ({
        url: 'quick-purchase-orders/statistics',
        params,
      }),
      providesTags: ['QuickPurchaseOrder'],
    }),
  }),
});

export const {
  useGetQuickPurchaseOrdersQuery,
  useGetQuickPurchaseOrderQuery,
  useCreateQuickPurchaseOrderMutation,
  useUpdateQuickPurchaseOrderMutation,
  useDeleteQuickPurchaseOrderMutation,
  useChangeQuickPurchaseOrderStatusMutation,
  useGetQuickPurchaseOrderStatisticsQuery,
} = quickPurchaseOrdersApi;

