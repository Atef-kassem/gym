import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../config/api.config';

export const shiftSessionApi = createApi({
  reducerPath: 'shiftSessionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.BASE_URL}/api/v1/shift-sessions`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ShiftSession', 'CurrentSession', 'DailyReport'],
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 0, // لا تحتفظ بالبيانات القديمة في الـ cache
  endpoints: (builder) => ({
    // بدء جلسة وردية جديدة
    startShiftSession: builder.mutation({
      query: (data) => ({
        url: '/start',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ShiftSession', 'CurrentSession'],
    }),

    // جلب الجلسة الحالية المفتوحة
    getCurrentSession: builder.query({
      query: (params) => ({
        url: '/current',
        params,
      }),
      providesTags: ['CurrentSession'],
      keepUnusedDataFor: 0,
    }),

    // جلب جلسة محددة
    getSessionById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'ShiftSession', id }],
      keepUnusedDataFor: 0,
    }),

    // جلب جميع الجلسات مع فلترة
    getAllSessions: builder.query({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'ShiftSession', id })),
              { type: 'ShiftSession', id: 'LIST' }
            ]
          : [{ type: 'ShiftSession', id: 'LIST' }],
      keepUnusedDataFor: 0,
    }),

    // إغلاق جلسة وردية
    closeShiftSession: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/close`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ShiftSession', id },
        { type: 'ShiftSession', id: 'LIST' },
        'ShiftSession',
        'CurrentSession',
        'DailyReport'
      ],
      // تحديث الـ cache مباشرة
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // إزالة الجلسة من قائمة الجلسات المفتوحة
        const patchResult = dispatch(
          shiftSessionApi.util.updateQueryData('getAllSessions', { status: 'open' }, (draft) => {
            if (draft?.data) {
              draft.data = draft.data.filter((session) => session.id !== id);
            }
          })
        );
        // مسح الجلسة الحالية
        dispatch(
          shiftSessionApi.util.updateQueryData('getCurrentSession', undefined, () => {
            return { data: null };
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // إغلاق تلقائي للجلسة (معطل بناءً على طلب المستخدم)
    /*
    autoCloseSession: builder.mutation({
      query: (id) => ({
        url: `/${id}/auto-close`,
        method: 'PUT',
      }),
      invalidatesTags: ['ShiftSession', 'CurrentSession', 'DailyReport'],
    }),
    */

    // جلب التقرير اليومي
    getDailyReport: builder.query({
      query: (params) => ({
        url: '/daily-report',
        params,
      }),
      providesTags: ['DailyReport'],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useStartShiftSessionMutation,
  useGetCurrentSessionQuery,
  useGetSessionByIdQuery,
  useGetAllSessionsQuery,
  useCloseShiftSessionMutation,
  // useAutoCloseSessionMutation, // معطل
  useGetDailyReportQuery,
} = shiftSessionApi;

// تصدير الـ API نفسه للاستخدام في reset وغيرها
export default shiftSessionApi;

