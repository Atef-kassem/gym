import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const lockersApi = createApi({
  reducerPath: 'lockersApi',
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
  tagTypes: ['Locker', 'LockerSubscription', 'LockerSubscriptionType'],
  endpoints: (builder) => ({
    // Lockers
    getAllLockers: builder.query({
      query: (params) => ({
        url: "/gym/lockers",
        params,
      }),
      providesTags: ["Locker"],
    }),
    getLockerById: builder.query({
      query: (id) => `/gym/lockers/${id}`,
      providesTags: (result, error, id) => [{ type: "Locker", id }],
    }),
    createLocker: builder.mutation({
      query: (data) => ({
        url: "/gym/lockers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Locker"],
    }),
    updateLocker: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/lockers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Locker", id },
        "Locker",
      ],
    }),
    deleteLocker: builder.mutation({
      query: (id) => ({
        url: `/gym/lockers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Locker"],
    }),
    getLockerStatistics: builder.query({
      query: () => "/gym/lockers/statistics",
      providesTags: ["Locker"],
    }),
    // Locker Subscription Types
    getLockerSubscriptionTypes: builder.query({
      query: () => "/gym/lockers/subscription-types/all",
      providesTags: ["LockerSubscriptionType"],
    }),
    createLockerSubscriptionType: builder.mutation({
      query: (data) => ({
        url: "/gym/lockers/subscription-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LockerSubscriptionType"],
    }),
    updateLockerSubscriptionType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/lockers/subscription-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LockerSubscriptionType"],
    }),
    deleteLockerSubscriptionType: builder.mutation({
      query: (id) => ({
        url: `/gym/lockers/subscription-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LockerSubscriptionType"],
    }),
    // Locker Subscriptions
    getAllLockerSubscriptions: builder.query({
      query: (params) => ({
        url: "/gym/lockers/subscriptions/all",
        params,
      }),
      providesTags: ["LockerSubscription"],
    }),
    createLockerSubscription: builder.mutation({
      query: (data) => ({
        url: "/gym/lockers/subscriptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LockerSubscription", "Locker"],
    }),
  }),
});

export const {
  useGetAllLockersQuery,
  useGetLockerByIdQuery,
  useCreateLockerMutation,
  useUpdateLockerMutation,
  useDeleteLockerMutation,
  useGetLockerStatisticsQuery,
  useGetLockerSubscriptionTypesQuery,
  useCreateLockerSubscriptionTypeMutation,
  useUpdateLockerSubscriptionTypeMutation,
  useDeleteLockerSubscriptionTypeMutation,
  useGetAllLockerSubscriptionsQuery,
  useCreateLockerSubscriptionMutation,
} = lockersApi;

