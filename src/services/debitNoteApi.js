import { apiSlice } from './apiSlice';

export const debitNoteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // جلب قائمة إشعارات المدين
    listDebitNotes: builder.query({
      query: (params = {}) => ({
        url: '/debit-notes',
        params,
      }),
      providesTags: ['DebitNote'],
    }),

    // جلب إشعار مدين واحد
    getDebitNote: builder.query({
      query: (id) => `/debit-notes/${id}`,
      providesTags: (result, error, id) => [{ type: 'DebitNote', id }],
    }),

    // إنشاء إشعار مدين جديد
    createDebitNote: builder.mutation({
      query: (data) => ({
        url: '/debit-notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DebitNote'],
    }),

    // تحديث إشعار مدين
    updateDebitNote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/debit-notes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DebitNote', id }],
    }),

    // حذف إشعار مدين
    deleteDebitNote: builder.mutation({
      query: (id) => ({
        url: `/debit-notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DebitNote'],
    }),

    // تغيير حالة إشعار المدين
    changeDebitNoteStatus: builder.mutation({
      query: ({ id, status, approver, notes }) => ({
        url: `/debit-notes/${id}/status`,
        method: 'PATCH',
        body: { status, approver, notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DebitNote', id }],
    }),

    // إرسال إشعار المدين للمورد
    sendDebitNoteToSupplier: builder.mutation({
      query: ({ id, email, cc, subject, message }) => ({
        url: `/debit-notes/${id}/send`,
        method: 'POST',
        body: { email, cc, subject, message },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DebitNote', id }],
    }),

    // جلب إحصائيات إشعارات المدين
    getDebitNoteStats: builder.query({
      query: (params = {}) => ({
        url: '/debit-notes/stats',
        params,
      }),
      providesTags: ['DebitNote'],
    }),
  }),
});

export const {
  useListDebitNotesQuery,
  useGetDebitNoteQuery,
  useCreateDebitNoteMutation,
  useUpdateDebitNoteMutation,
  useDeleteDebitNoteMutation,
  useChangeDebitNoteStatusMutation,
  useSendDebitNoteToSupplierMutation,
  useGetDebitNoteStatsQuery,
} = debitNoteApi;
