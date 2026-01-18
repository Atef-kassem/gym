import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const subscriptionTransfersApi = createApi({
  reducerPath: 'subscriptionTransfersApi',
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
  tagTypes: ['SubscriptionTransfer'],
  endpoints: (builder) => ({
    getAllTransfers: builder.query({
      query: (params) => ({
        url: "/gym/subscription-transfers",
        params,
      }),
      transformResponse: (response, meta, arg) => {
        console.log('🔄 SubscriptionTransfers API Response:', {
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
      providesTags: ["SubscriptionTransfer"],
    }),
    getTransferById: builder.query({
      query: (id) => `/gym/subscription-transfers/${id}`,
      providesTags: (result, error, id) => [{ type: "SubscriptionTransfer", id }],
    }),
    createTransfer: builder.mutation({
      query: (data) => ({
        url: "/gym/subscription-transfers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubscriptionTransfer"],
    }),
    getMemberSubscriptionHistory: builder.query({
      query: (memberId) => `/gym/subscription-transfers/member/${memberId}/history`,
      providesTags: (result, error, memberId) => [{ type: "SubscriptionTransfer", id: `member-${memberId}` }],
    }),
    getTransferStatistics: builder.query({
      query: (params) => ({
        url: "/gym/subscription-transfers/statistics",
        params,
      }),
      providesTags: ["SubscriptionTransfer"],
    }),
  }),
});

export const {
  useGetAllTransfersQuery,
  useGetTransferByIdQuery,
  useCreateTransferMutation,
  useGetMemberSubscriptionHistoryQuery,
  useGetTransferStatisticsQuery,
} = subscriptionTransfersApi;

