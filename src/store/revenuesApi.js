import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const revenuesApi = createApi({
  reducerPath: 'revenuesApi',
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
  tagTypes: ['Revenue'],
  endpoints: (builder) => ({
    getRevenues: builder.query({
      query: (params) => ({
        url: 'revenues',
        params,
      }),
      providesTags: ['Revenue'],
    }),

    getRevenue: builder.query({
      query: (id) => `revenues/${id}`,
      providesTags: (result, error, id) => [{ type: 'Revenue', id }],
    }),

    createRevenue: builder.mutation({
      query: (revenue) => ({
        url: 'revenues',
        method: 'POST',
        body: revenue,
      }),
      invalidatesTags: ['Revenue'],
    }),

    updateRevenue: builder.mutation({
      query: ({ id, data }) => ({
        url: `revenues/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Revenue', id },
        'Revenue',
      ],
    }),

    deleteRevenue: builder.mutation({
      query: (id) => ({
        url: `revenues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Revenue'],
    }),

    getRevenueStatistics: builder.query({
      query: (params) => ({
        url: 'revenues/statistics',
        params,
      }),
      providesTags: ['Revenue'],
    }),

    getTopCustomers: builder.query({
      query: (params) => ({
        url: 'revenues/top-customers',
        params,
      }),
      providesTags: ['Revenue'],
    }),

    syncRevenues: builder.mutation({
      query: (params) => ({
        url: 'revenues/sync',
        method: 'POST',
        params,
      }),
      invalidatesTags: ['Revenue'],
    }),

    getRevenuesFromSales: builder.query({
      query: (params) => ({
        url: 'revenues/from-sales',
        params,
      }),
      providesTags: ['Revenue'],
    }),
  }),
});

export const {
  useGetRevenuesQuery,
  useGetRevenueQuery,
  useSyncRevenuesMutation,
  useGetRevenuesFromSalesQuery,
  useCreateRevenueMutation,
  useUpdateRevenueMutation,
  useDeleteRevenueMutation,
  useGetRevenueStatisticsQuery,
  useGetTopCustomersQuery,
} = revenuesApi;

