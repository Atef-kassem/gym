import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const deliveryDriverApi = createApi({
  reducerPath: 'deliveryDriverApi',
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
  tagTypes: ['DeliveryDriver'],
  endpoints: (builder) => ({
    // الحصول على جميع السائقين
    getAllDeliveryDrivers: builder.query({
      query: (params) => ({
        url: '/delivery-drivers',
        params,
      }),
      providesTags: ['DeliveryDriver'],
    }),

    // الحصول على سائق واحد
    getDeliveryDriverById: builder.query({
      query: (id) => `/delivery-drivers/${id}`,
      providesTags: (result, error, id) => [{ type: 'DeliveryDriver', id }],
    }),

    // الحصول على السائقين المتاحين
    getAvailableDrivers: builder.query({
      query: () => '/delivery-drivers/available',
      providesTags: ['DeliveryDriver'],
    }),

    // إنشاء سائق جديد
    createDeliveryDriver: builder.mutation({
      query: (data) => ({
        url: '/delivery-drivers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DeliveryDriver'],
    }),

    // تحديث سائق
    updateDeliveryDriver: builder.mutation({
      query: ({ id, data }) => ({
        url: `/delivery-drivers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DeliveryDriver', id }],
    }),

    // حذف سائق
    deleteDeliveryDriver: builder.mutation({
      query: (id) => ({
        url: `/delivery-drivers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DeliveryDriver'],
    }),

    // تحديث حالة السائق
    updateDriverStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/delivery-drivers/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DeliveryDriver', id }],
    }),
  }),
});

export const {
  useGetAllDeliveryDriversQuery,
  useGetDeliveryDriverByIdQuery,
  useGetAvailableDriversQuery,
  useCreateDeliveryDriverMutation,
  useUpdateDeliveryDriverMutation,
  useDeleteDeliveryDriverMutation,
  useUpdateDriverStatusMutation,
} = deliveryDriverApi;

