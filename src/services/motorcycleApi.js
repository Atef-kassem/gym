import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const motorcycleApi = createApi({
  reducerPath: 'motorcycleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/v1`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Motorcycle'],
  endpoints: (builder) => ({
    // الحصول على إحصائيات الدراجات النارية
    getMotorcycleStats: builder.query({
      query: (params) => ({
        url: '/motorcycles/stats',
        params,
      }),
      providesTags: ['Motorcycle'],
    }),

    // الحصول على جميع الدراجات النارية
    getAllMotorcycles: builder.query({
      query: (params) => ({
        url: '/motorcycles',
        params,
      }),
      providesTags: ['Motorcycle'],
    }),

    // الحصول على دراجة نارية واحدة
    getMotorcycleById: builder.query({
      query: (id) => `/motorcycles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Motorcycle', id }],
    }),

    // الحصول على الرمز التالي
    getNextMotorcycleCode: builder.query({
      query: () => '/motorcycles/next-code',
    }),

    // إنشاء دراجة نارية جديدة
    createMotorcycle: builder.mutation({
      query: (data) => ({
        url: '/motorcycles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Motorcycle'],
    }),

    // تحديث دراجة نارية
    updateMotorcycle: builder.mutation({
      query: ({ id, data }) => ({
        url: `/motorcycles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Motorcycle', id }],
    }),

    // حذف دراجة نارية
    deleteMotorcycle: builder.mutation({
      query: (id) => ({
        url: `/motorcycles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Motorcycle'],
    }),

    // تحديث حالة الدراجة النارية
    updateMotorcycleStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/motorcycles/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Motorcycle', id }],
    }),
  }),
});

export const {
  useGetMotorcycleStatsQuery,
  useGetAllMotorcyclesQuery,
  useGetMotorcycleByIdQuery,
  useGetNextMotorcycleCodeQuery,
  useCreateMotorcycleMutation,
  useUpdateMotorcycleMutation,
  useDeleteMotorcycleMutation,
  useUpdateMotorcycleStatusMutation,
} = motorcycleApi;

