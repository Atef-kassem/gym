import { apiSlice } from './apiSlice';

// تحديث baseUrl ليتطابق مع الخادم
const BASE_URL = 'https://metagym.metacodecx.com';

export const plansApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // الحصول على جميع الخطط
    getPlans: builder.query({
      query: (params) => ({
        url: `${BASE_URL}/api/v1/plans`,
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10000000,
          search: params?.search || '',
          interval: params?.interval || 'all',
          popular: params?.popular || undefined,
          sortBy: params?.sortBy || 'createdAt',
          sortOrder: params?.sortOrder || 'DESC'
        }
      }),
      providesTags: ['Plans']
    }),

    // الحصول على خطة واحدة
    getPlan: builder.query({
      query: (id) => `${BASE_URL}/api/v1/plans/${id}`,
      providesTags: (result, error, id) => [{ type: 'Plans', id }]
    }),

    // إنشاء خطة جديدة
    createPlan: builder.mutation({
      query: (planData) => ({
        url: `${BASE_URL}/api/v1/plans`,
        method: 'POST',
        body: planData
      }),
      invalidatesTags: ['Plans']
    }),

    // تحديث خطة
    updatePlan: builder.mutation({
      query: ({ id, ...planData }) => ({
        url: `${BASE_URL}/api/v1/plans/${id}`,
        method: 'PATCH',
        body: planData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Plans', id }]
    }),

    // حذف خطة
    deletePlan: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/v1/plans/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Plans']
    }),

    // تبديل حالة الخطة
    togglePlanStatus: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/v1/plans/${id}/status`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Plans']
    }),

    // نسخ خطة
    duplicatePlan: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/v1/plans/${id}/duplicate`,
        method: 'POST'
      }),
      invalidatesTags: ['Plans']
    }),

    // الحصول على إحصائيات الخطط
    getPlanStats: builder.query({
      query: () => `${BASE_URL}/api/v1/plans/stats`,
      providesTags: ['PlanStats']
    })
  })
});

export const {
  useGetPlansQuery,
  useGetPlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useTogglePlanStatusMutation,
  useDuplicatePlanMutation,
  useGetPlanStatsQuery
} = plansApi;
