import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const deliveryOrderApi = createApi({
  reducerPath: 'deliveryOrderApi',
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
  tagTypes: ['DeliveryOrder'],
  endpoints: (builder) => ({
    // الحصول على جميع طلبات التوصيل
    getAllDeliveryOrders: builder.query({
      query: (params) => ({
        url: '/delivery-orders',
        params,
      }),
      providesTags: ['DeliveryOrder'],
    }),

    // الحصول على طلب توصيل واحد
    getDeliveryOrderById: builder.query({
      query: (id) => `/delivery-orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'DeliveryOrder', id }],
    }),

    // إنشاء طلب توصيل جديد
    createDeliveryOrder: builder.mutation({
      query: (data) => ({
        url: '/delivery-orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DeliveryOrder'],
    }),

    // تحديث طلب توصيل
    updateDeliveryOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/delivery-orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DeliveryOrder', id }],
    }),

    // حذف طلب توصيل
    deleteDeliveryOrder: builder.mutation({
      query: (id) => ({
        url: `/delivery-orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DeliveryOrder'],
    }),

    // تحديث حالة طلب التوصيل
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/delivery-orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DeliveryOrder', id }],
    }),

    // تعيين سائق لطلب التوصيل
    assignDriver: builder.mutation({
      query: ({ id, driverId, motorcycleId }) => ({
        url: `/delivery-orders/${id}/assign-driver`,
        method: 'PATCH',
        body: { driverId, motorcycleId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DeliveryOrder', id }],
    }),
  }),
});

export const {
  useGetAllDeliveryOrdersQuery,
  useGetDeliveryOrderByIdQuery,
  useCreateDeliveryOrderMutation,
  useUpdateDeliveryOrderMutation,
  useDeleteDeliveryOrderMutation,
  useUpdateOrderStatusMutation,
  useAssignDriverMutation,
} = deliveryOrderApi;

