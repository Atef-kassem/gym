import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const maintenanceApi = createApi({
  reducerPath: 'maintenanceApi',
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
  tagTypes: ['Maintenance'],
  endpoints: (builder) => ({
    // الحصول على جميع سجلات الصيانة
    getAllMaintenances: builder.query({
      query: (params) => ({
        url: '/motorcycle-maintenance',
        params,
      }),
      providesTags: ['Maintenance'],
    }),

    // الحصول على سجل صيانة واحد
    getMaintenanceById: builder.query({
      query: (id) => `/motorcycle-maintenance/${id}`,
      providesTags: (result, error, id) => [{ type: 'Maintenance', id }],
    }),

    // إنشاء سجل صيانة جديد
    createMaintenance: builder.mutation({
      query: (data) => ({
        url: '/motorcycle-maintenance',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Maintenance'],
    }),

    // تحديث سجل صيانة
    updateMaintenance: builder.mutation({
      query: ({ id, data }) => ({
        url: `/motorcycle-maintenance/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Maintenance', id }],
    }),

    // حذف سجل صيانة
    deleteMaintenance: builder.mutation({
      query: (id) => ({
        url: `/motorcycle-maintenance/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Maintenance'],
    }),

    // تحديث حالة الصيانة
    updateMaintenanceStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/motorcycle-maintenance/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Maintenance', id }],
    }),
  }),
});

export const {
  useGetAllMaintenancesQuery,
  useGetMaintenanceByIdQuery,
  useCreateMaintenanceMutation,
  useUpdateMaintenanceMutation,
  useDeleteMaintenanceMutation,
  useUpdateMaintenanceStatusMutation,
} = maintenanceApi;

