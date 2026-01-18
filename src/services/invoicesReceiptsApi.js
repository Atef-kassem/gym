import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const invoicesReceiptsApi = createApi({
  reducerPath: 'invoicesReceiptsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/v1/`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Invoice', 'InvoiceStatistics'],
  endpoints: (builder) => ({
    // جلب جميع الإيصالات من الاشتراكات (العادية والخاصة)
    getInvoices: builder.query({
      query: (params) => ({
        url: 'subscriptions',
        params: {
          search: params?.search || '',
          status: params?.status || '',
          subscriptionType: params?.type || '',
          // لا نفلتر على isSpecial للحصول على العادية والخاصة معاً
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Invoice', id })),
              { type: 'Invoice', id: 'LIST' },
            ]
          : [{ type: 'Invoice', id: 'LIST' }],
    }),

    // جلب ايصال/اشتراك محددة
    getInvoice: builder.query({
      query: (id) => `subscriptions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),

    // إنشاء ايصال/اشتراك جديدة
    createInvoice: builder.mutation({
      query: (invoiceData) => ({
        url: 'subscriptions',
        method: 'POST',
        body: {
          customerName: invoiceData.memberName,
          subscriptionValue: invoiceData.amount,
          paidAmount: invoiceData.status === "مدفوعة" ? invoiceData.amount : 0,
          subscriptionStartDate: invoiceData.date,
          subscriptionEndDate: invoiceData.endDate || invoiceData.date,
          subscriptionType: invoiceData.type,
          receiptNumber: invoiceData.receiptNumber || null,
          isSpecial: invoiceData.isSpecial || false,
          branchId: invoiceData.branchId || 1, // يجب تحديد branchId
          // يمكن إضافة المزيد من الحقول حسب الحاجة
        },
      }),
      invalidatesTags: ['Invoice', 'InvoiceStatistics'],
    }),

    // تحديث ايصال/اشتراك
    updateInvoice: builder.mutation({
      query: ({ id, data }) => ({
        url: `subscriptions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Invoice', id },
        'Invoice',
        'InvoiceStatistics',
      ],
    }),

    // حذف ايصال/اشتراك
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `subscriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoice', 'InvoiceStatistics'],
    }),

    // تحديث حالة الايصال/الاشتراك
    updateInvoiceStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `subscriptions/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Invoice', id },
        'Invoice',
        'InvoiceStatistics',
      ],
    }),

    // جلب إحصائيات الإيصالات من الاشتراكات
    getInvoiceStatistics: builder.query({
      query: (params) => ({
        url: 'subscriptions/statistics',
        params: {
          // لا نرسل isSpecial للحصول على إحصائيات العادية والخاصة معاً
        },
      }),
      providesTags: ['InvoiceStatistics'],
    }),

    // تحميل الايصال كـ PDF
    // ملاحظة: يحتاج endpoint مخصص في الـ backend للتحميل
    downloadInvoice: builder.query({
      query: (id) => `subscriptions/${id}`,
    }),

    // طباعة الايصال
    // ملاحظة: يحتاج endpoint مخصص في الـ backend للطباعة
    printInvoice: builder.query({
      query: (id) => `subscriptions/${id}`,
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useGetInvoiceStatisticsQuery,
  useLazyDownloadInvoiceQuery,
  useLazyPrintInvoiceQuery,
} = invoicesReceiptsApi;

