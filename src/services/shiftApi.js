import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com/api/v1';

export const shiftApi = createApi({
  reducerPath: 'shiftApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Shift'],
  refetchOnMountOrArgChange: 30, // إعادة جلب البيانات كل 30 ثانية
  refetchOnFocus: true, // إعادة جلب عند العودة للصفحة
  refetchOnReconnect: true, // إعادة جلب عند استعادة الاتصال
  endpoints: (builder) => ({
    // جلب جميع الورديات
    getAllShifts: builder.query({
      query: (params) => ({
        url: '/shifts',
        params
      }),
      providesTags: (result) => 
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Shift', id })),
              { type: 'Shift', id: 'LIST' }
            ]
          : [{ type: 'Shift', id: 'LIST' }],
      keepUnusedDataFor: 0, // لا تحتفظ بالبيانات القديمة
    }),
    
    // جلب وردية محددة
    getShiftById: builder.query({
      query: (id) => `/shifts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Shift', id }],
      keepUnusedDataFor: 0,
    }),
    
    // جلب الوردية الحالية
    getCurrentShift: builder.query({
      query: () => '/shifts/current',
      providesTags: ['Shift'],
      keepUnusedDataFor: 0,
    }),
    
    // جلب إيرادات وردية محددة
    getShiftRevenue: builder.query({
      query: ({ shiftId, date }) => `/shifts/${shiftId}/revenue?date=${date}`,
      providesTags: ['Shift'],
      keepUnusedDataFor: 0,
    }),
    
    // إنشاء وردية جديدة
    createShift: builder.mutation({
      query: (shiftData) => ({
        url: '/shifts',
        method: 'POST',
        body: shiftData
      }),
      invalidatesTags: ['Shift']
    }),
    
    // تحديث وردية
    updateShift: builder.mutation({
      query: ({ id, ...shiftData }) => ({
        url: `/shifts/${id}`,
        method: 'PUT',
        body: shiftData
      }),
      invalidatesTags: ['Shift']
    }),
    
    // حذف وردية
    deleteShift: builder.mutation({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Shift', id },
        { type: 'Shift', id: 'LIST' },
        'Shift' // تنظيف كل الـ cache المتعلق بالورديات
      ],
      // تحديث الـ cache مباشرة بعد الحذف
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          shiftApi.util.updateQueryData('getAllShifts', undefined, (draft) => {
            if (draft?.data) {
              draft.data = draft.data.filter((shift) => shift.id !== id);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    })
  })
});

export const {
  useGetAllShiftsQuery,
  useGetShiftByIdQuery,
  useGetCurrentShiftQuery,
  useGetShiftRevenueQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation
} = shiftApi;

// تصدير الـ API نفسه للاستخدام في reset وغيرها
export default shiftApi;

