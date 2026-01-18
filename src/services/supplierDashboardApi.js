import { apiSlice } from "./apiSlice";

export const supplierDashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // جلب إحصائيات الموردين
    getSupplierStats: builder.query({
      query: () => '/supplier-dashboard/stats',
      providesTags: ['SupplierStats'],
    }),

    // جلب قائمة الموردين مع فلترة
    getSuppliers: builder.query({
      query: (params = {}) => {
        const {
          page = 1,
          limit = 100,
          search,
          status,
          category,
          region,
          sortBy = 'name_ar',
          sortOrder = 'ASC'
        } = params;

        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        if (category) queryParams.append('category', category);
        if (region) queryParams.append('region', region);
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);

        return `/suppliers?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data?.suppliers?.map(({ id }) => ({ type: 'Supplier', id })) || [],
              { type: 'Supplier', id: 'LIST' }
            ]
          : [{ type: 'Supplier', id: 'LIST' }],
    }),

    // جلب أفضل الموردين
    getTopSuppliers: builder.query({
      query: (limit = 10) => `/supplier-dashboard/top?limit=${limit}`,
      providesTags: ['TopSuppliers'],
    }),

    // جلب نشاط الموردين
    getSupplierActivity: builder.query({
      query: (params = {}) => {
        const { days = 30, supplierId } = params;
        const queryParams = new URLSearchParams();
        if (days) queryParams.append('days', days);
        if (supplierId) queryParams.append('supplierId', supplierId);
        
        return `/supplier-dashboard/activity?${queryParams.toString()}`;
      },
      providesTags: ['SupplierActivity'],
    }),

    // جلب تقارير الأداء
    getSupplierPerformance: builder.query({
      query: (params = {}) => {
        const { period = 'month', category, region } = params;
        const queryParams = new URLSearchParams();
        if (period) queryParams.append('period', period);
        if (category) queryParams.append('category', category);
        if (region) queryParams.append('region', region);
        
        return `/supplier-dashboard/performance?${queryParams.toString()}`;
      },
      providesTags: ['SupplierPerformance'],
    }),

    // جلب التنبيهات
    getSupplierAlerts: builder.query({
      query: () => '/supplier-dashboard/alerts',
      providesTags: ['SupplierAlerts'],
    }),

    // جلب العقود النشطة
    getActiveContracts: builder.query({
      query: (params = {}) => {
        const { status, supplierId, expiryDate } = params;
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (supplierId) queryParams.append('supplierId', supplierId);
        if (expiryDate) queryParams.append('expiryDate', expiryDate);
        
        return `/supplier-dashboard/contracts?${queryParams.toString()}`;
      },
      providesTags: ['SupplierContracts'],
    }),

    // جلب المدفوعات
    getSupplierPayments: builder.query({
      query: (params = {}) => {
        const { status, supplierId, dateFrom, dateTo } = params;
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (supplierId) queryParams.append('supplierId', supplierId);
        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);
        
        return `/supplier-dashboard/payments?${queryParams.toString()}`;
      },
      providesTags: ['SupplierPayments'],
    }),

    // إنشاء مورد جديد
    createSupplier: builder.mutation({
      query: (supplier) => ({
        url: '/suppliers',
        method: 'POST',
        body: supplier,
      }),
      invalidatesTags: ['Supplier', 'SupplierStats', 'TopSuppliers'],
    }),

    // تحديث مورد
    updateSupplier: builder.mutation({
      query: ({ id, ...supplier }) => ({
        url: `/suppliers/${id}`,
        method: 'PUT',
        body: supplier,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Supplier', id },
        { type: 'Supplier', id: 'LIST' },
        'SupplierStats',
        'TopSuppliers'
      ],
    }),

    // حذف مورد
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplier', 'SupplierStats', 'TopSuppliers'],
    }),

    // تحديث حالة المورد
    updateSupplierStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/suppliers/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Supplier', id },
        { type: 'Supplier', id: 'LIST' },
        'SupplierStats',
        'TopSuppliers'
      ],
    }),

    // تقييم المورد
    rateSupplier: builder.mutation({
      query: ({ id, rating, feedback }) => ({
        url: `/suppliers/${id}/rate`,
        method: 'POST',
        body: { rating, feedback },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Supplier', id },
        { type: 'Supplier', id: 'LIST' },
        'TopSuppliers',
        'SupplierPerformance'
      ],
    }),

    // تصدير بيانات الموردين
    exportSuppliers: builder.mutation({
      query: (params) => ({
        url: '/supplier-dashboard/export',
        method: 'POST',
        body: params,
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `suppliers_${new Date().toISOString().split('T')[0]}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
    }),
  }),
});

export const {
  useGetSupplierStatsQuery,
  useGetSuppliersQuery,
  useGetTopSuppliersQuery,
  useGetSupplierActivityQuery,
  useGetSupplierPerformanceQuery,
  useGetSupplierAlertsQuery,
  useGetActiveContractsQuery,
  useGetSupplierPaymentsQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useUpdateSupplierStatusMutation,
  useRateSupplierMutation,
  useExportSuppliersMutation,
} = supplierDashboardApi;
