import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com/api/v1';

export const memberAttendanceApi = createApi({
  reducerPath: 'memberAttendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/gym/member-attendance`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['MemberAttendance'],
  endpoints: (builder) => ({
    // تسجيل دخول
    checkIn: builder.mutation({
      query: (data) => ({
        url: '/check-in',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MemberAttendance'],
    }),

    // تسجيل خروج
    checkOut: builder.mutation({
      query: (data) => ({
        url: '/check-out',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MemberAttendance'],
    }),

    // جلب سجل الحضور
    getAttendanceRecords: builder.query({
      query: (params = {}) => ({
        url: '/',
        params,
      }),
      providesTags: ['MemberAttendance'],
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response.data || response || [];
      },
    }),

    // جلب إحصائيات الحضور
    getAttendanceStatistics: builder.query({
      query: (params = {}) => ({
        url: '/statistics',
        params,
      }),
      providesTags: ['MemberAttendance'],
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response.data || {};
      },
    }),
  }),
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useGetAttendanceRecordsQuery,
  useGetAttendanceStatisticsQuery,
} = memberAttendanceApi;

