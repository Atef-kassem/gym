import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const subscriptionRefundsApi = createApi({
  reducerPath: 'subscriptionRefundsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE_URL}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['SubscriptionRefund'],
  endpoints: (builder) => ({
    getAllRefunds: builder.query({
      query: (params) => ({
        url: "/gym/subscription-refunds",
        params,
      }),
      transformResponse: (response, meta, arg) => {
        console.log('🔄 SubscriptionRefunds API Response:', {
          response,
          responseType: typeof response,
          hasSuccess: !!response?.success,
          hasData: !!response?.data,
          dataType: typeof response?.data,
          isArray: Array.isArray(response?.data),
          dataLength: response?.data?.length
        });
        
        // Handle both response formats
        if (response?.success && response?.data) {
          console.log('✅ Returning response.data:', response.data);
          return response.data;
        }
        if (response?.data) {
          console.log('✅ Returning response.data (no success):', response.data);
          return response.data;
        }
        if (Array.isArray(response)) {
          console.log('✅ Returning response as array:', response);
          return response;
        }
        console.log('⚠️ Returning empty array');
        return [];
      },
      providesTags: ["SubscriptionRefund"],
    }),
    getRefundById: builder.query({
      query: (id) => `/gym/subscription-refunds/${id}`,
      providesTags: (result, error, id) => [{ type: "SubscriptionRefund", id }],
    }),
    createRefund: builder.mutation({
      query: (data) => ({
        url: "/gym/subscription-refunds",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubscriptionRefund"],
    }),
    updateRefundStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/gym/subscription-refunds/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SubscriptionRefund", id },
        "SubscriptionRefund",
      ],
    }),
    getRefundStatistics: builder.query({
      query: (params) => ({
        url: "/gym/subscription-refunds/statistics",
        params,
      }),
      providesTags: ["SubscriptionRefund"],
    }),
  }),
});

export const {
  useGetAllRefundsQuery,
  useGetRefundByIdQuery,
  useCreateRefundMutation,
  useUpdateRefundStatusMutation,
  useGetRefundStatisticsQuery,
} = subscriptionRefundsApi;

