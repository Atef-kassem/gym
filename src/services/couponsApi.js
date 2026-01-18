import { apiSlice } from './apiSlice';

// تحديث baseUrl ليتطابق مع الخادم
const BASE_URL = 'https://metagym.metacodecx.com';

export const couponsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // الحصول على جميع الكوبونات
    getCoupons: builder.query({
      query: (params) => ({
        url: `${BASE_URL}/api/v1/coupons`,
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10000000,
          search: params?.search || '',
          status: params?.status || 'all',
          type: params?.type || 'all',
          startDate: params?.startDate || '',
          endDate: params?.endDate || '',
          sortBy: params?.sortBy || 'createdAt',
          sortOrder: params?.sortOrder || 'DESC'
        }
      }),
      providesTags: ['Coupons']
    }),

    // الحصول على كوبون واحد
    getCoupon: builder.query({
      query: (id) => `${BASE_URL}/api/v1/coupons/${id}`,
      providesTags: (result, error, id) => [{ type: 'Coupons', id }]
    }),

    // إنشاء كوبون جديد
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: `${BASE_URL}/api/v1/coupons`,
        method: 'POST',
        body: couponData
      }),
      invalidatesTags: ['Coupons']
    }),

    // تحديث كوبون
    updateCoupon: builder.mutation({
      query: ({ id, ...couponData }) => ({
        url: `${BASE_URL}/api/v1/coupons/${id}`,
        method: 'PATCH',
        body: couponData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Coupons', id },
        { type: 'Coupons', id: 'LIST' }
      ]
    }),

    // حذف كوبون
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/v1/coupons/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Coupons']
    }),

    // تبديل حالة الكوبون
    toggleCouponStatus: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/v1/coupons/${id}/toggle-status`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Coupons']
    }),

    // نسخ كوبون
    duplicateCoupon: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/v1/coupons/${id}/duplicate`,
        method: 'POST'
      }),
      invalidatesTags: ['Coupons']
    }),

    // الحصول على إحصائيات الكوبونات
    getCouponStats: builder.query({
      query: () => `${BASE_URL}/api/v1/coupons/stats`,
      providesTags: ['CouponStats']
    }),

    // البحث عن كوبون بالرمز
    findCouponByCode: builder.query({
      query: (code) => `${BASE_URL}/api/v1/coupons/code/${code}`,
      providesTags: (result, error, code) => [{ type: 'CouponByCode', code }]
    }),

    // تحديث استخدام الكوبون
    updateCouponUsage: builder.mutation({
      query: ({ id, orderAmount, revenue }) => ({
        url: `${BASE_URL}/api/v1/coupons/${id}/usage`,
        method: 'PATCH',
        body: { orderAmount, revenue }
      }),
      invalidatesTags: ['Coupons', 'CouponStats']
    }),

    // تصدير الكوبونات
    exportCoupons: builder.mutation({
      query: (format = 'json') => ({
        url: `${BASE_URL}/api/v1/coupons/export`,
        method: 'GET',
        params: { format }
      })
    }),

    // الحصول على الكوبونات منتهية الصلاحية
    getExpiredCoupons: builder.query({
      query: () => `${BASE_URL}/api/v1/coupons/expired`,
      providesTags: ['ExpiredCoupons']
    }),

    // تحديث الكوبونات منتهية الصلاحية
    updateExpiredCoupons: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/api/v1/coupons/expired`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Coupons', 'ExpiredCoupons', 'CouponStats']
    })
  })
});

export const {
  useGetCouponsQuery,
  useGetCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
  useDuplicateCouponMutation,
  useGetCouponStatsQuery,
  useFindCouponByCodeQuery,
  useUpdateCouponUsageMutation,
  useExportCouponsMutation,
  useGetExpiredCouponsQuery,
  useUpdateExpiredCouponsMutation
} = couponsApi;
