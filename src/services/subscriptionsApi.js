import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const subscriptionsApi = createApi({
  reducerPath: 'subscriptionsApi',
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
  tagTypes: ['Subscription', 'SubscriptionType', 'SubscriptionTransfer', 'TimeBasedSpecialSubscription'],
  endpoints: (builder) => ({
    getAllSubscriptions: builder.query({
      query: (params) => ({
        url: "/gym/subscriptions",
        params,
      }),
      providesTags: ["Subscription"],
    }),
    getSubscriptionById: builder.query({
      query: (id) => `/gym/subscriptions/${id}`,
      providesTags: (result, error, id) => [{ type: "Subscription", id }],
    }),
    createSubscription: builder.mutation({
      query: (data) => ({
        url: "/gym/subscriptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    updateSubscription: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/subscriptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Subscription", id },
        "Subscription",
      ],
    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/gym/subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
    getSubscriptionStatistics: builder.query({
      query: (params) => ({
        url: "/gym/subscriptions/statistics",
        params,
      }),
      providesTags: ["Subscription"],
    }),

    // Gym subscription types (templates)
    getSubscriptionTypes: builder.query({
      query: () => "/gym/subscription-types/all",
      providesTags: ["SubscriptionType"],
    }),
    createSubscriptionType: builder.mutation({
      query: (data) => ({
        url: "/gym/subscription-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubscriptionType"],
    }),
    updateSubscriptionType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/subscription-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SubscriptionType", id },
        "SubscriptionType",
      ],
    }),
    deleteSubscriptionType: builder.mutation({
      query: (id) => ({
        url: `/gym/subscription-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionType"],
    }),

    // Subscription Transfers
    getAllSubscriptionTransfers: builder.query({
      query: (params) => ({
        url: "/gym/subscription-transfers",
        params,
      }),
      providesTags: ["SubscriptionTransfer"],
    }),
    getSubscriptionTransferById: builder.query({
      query: (id) => `/gym/subscription-transfers/${id}`,
      providesTags: (result, error, id) => [{ type: "SubscriptionTransfer", id }],
    }),
    createSubscriptionTransfer: builder.mutation({
      query: (data) => ({
        url: "/gym/subscription-transfers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubscriptionTransfer", "Subscription"],
    }),

    // Time-Based Special Subscriptions
    getAllTimeBasedSpecialSubscriptions: builder.query({
      query: (params) => ({
        url: "/gym/time-based-special-subscriptions",
        params,
      }),
      providesTags: ["TimeBasedSpecialSubscription"],
    }),
    getTimeBasedSpecialSubscriptionById: builder.query({
      query: (id) => `/gym/time-based-special-subscriptions/${id}`,
      providesTags: (result, error, id) => [{ type: "TimeBasedSpecialSubscription", id }],
    }),
    createTimeBasedSpecialSubscription: builder.mutation({
      query: (data) => ({
        url: "/gym/time-based-special-subscriptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TimeBasedSpecialSubscription"],
    }),
    updateTimeBasedSpecialSubscription: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/time-based-special-subscriptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TimeBasedSpecialSubscription", id },
        "TimeBasedSpecialSubscription",
      ],
    }),
    deleteTimeBasedSpecialSubscription: builder.mutation({
      query: (id) => ({
        url: `/gym/time-based-special-subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TimeBasedSpecialSubscription"],
    }),
    getTimeBasedSpecialSubscriptionStatistics: builder.query({
      query: (params) => ({
        url: "/gym/time-based-special-subscriptions/statistics",
        params,
      }),
      providesTags: ["TimeBasedSpecialSubscription"],
    }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionStatisticsQuery,
  useGetSubscriptionTypesQuery,
  useCreateSubscriptionTypeMutation,
  useUpdateSubscriptionTypeMutation,
  useDeleteSubscriptionTypeMutation,
  useGetAllSubscriptionTransfersQuery,
  useGetSubscriptionTransferByIdQuery,
  useCreateSubscriptionTransferMutation,
  useGetAllTimeBasedSpecialSubscriptionsQuery,
  useGetTimeBasedSpecialSubscriptionByIdQuery,
  useCreateTimeBasedSpecialSubscriptionMutation,
  useUpdateTimeBasedSpecialSubscriptionMutation,
  useDeleteTimeBasedSpecialSubscriptionMutation,
  useGetTimeBasedSpecialSubscriptionStatisticsQuery,
} = subscriptionsApi;
