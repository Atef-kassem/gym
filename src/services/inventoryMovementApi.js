import { apiSlice } from "./apiSlice";

export const inventoryMovementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // جلب جميع حركات المخزون مع الفلترة
    getInventoryMovements: builder.query({
      query: (params = {}) => {
        const {
          page = 1,
          limit = 50,
          search,
          transactionType,
          warehouse,
          dateFrom,
          dateTo,
          category,
          riskLevel,
          userId
        } = params;

        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (transactionType && transactionType !== 'all') queryParams.append('transactionType', transactionType);
        if (warehouse && warehouse !== 'all') queryParams.append('warehouse', warehouse);
        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);
        if (category) queryParams.append('category', category);
        if (riskLevel) queryParams.append('riskLevel', riskLevel);
        if (userId) queryParams.append('userId', userId);

        return `/inventory-movements/movements?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.rows.map(({ id }) => ({ type: 'InventoryMovement', id })),
              { type: 'InventoryMovement', id: 'LIST' }
            ]
          : [{ type: 'InventoryMovement', id: 'LIST' }],
    }),

    // جلب حركة محددة بواسطة المعرف
    getInventoryMovementById: builder.query({
      query: (id) => `/inventory-movements/movements/${id}`,
      providesTags: (result, error, id) => [{ type: 'InventoryMovement', id }],
    }),

    // إنشاء حركة مخزون جديدة
    createInventoryMovement: builder.mutation({
      query: (movement) => ({
        url: '/inventory-movements/movements',
        method: 'POST',
        body: movement,
      }),
      invalidatesTags: [{ type: 'InventoryMovement', id: 'LIST' }],
    }),

    // تحديث حركة مخزون
    updateInventoryMovement: builder.mutation({
      query: ({ id, ...movement }) => ({
        url: `/inventory-movements/movements/${id}`,
        method: 'PUT',
        body: movement,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'InventoryMovement', id },
        { type: 'InventoryMovement', id: 'LIST' }
      ],
    }),

    // حذف حركة مخزون
    deleteInventoryMovement: builder.mutation({
      query: (id) => ({
        url: `/inventory-movements/movements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'InventoryMovement', id: 'LIST' }],
    }),

    // جلب الإحصائيات
    getInventoryMovementStatistics: builder.query({
      query: () => '/inventory-movements/statistics',
      providesTags: ['InventoryMovementStats'],
    }),

    // جلب الرؤى الذكية
    getAIInsights: builder.query({
      query: () => '/inventory-movements/ai-insights',
      providesTags: ['AIInsights'],
    }),

    // جلب التنبيهات الذكية
    getSmartAlerts: builder.query({
      query: () => '/inventory-movements/smart-alerts',
      providesTags: ['SmartAlerts'],
    }),

    // تحديث حالة التنبيه
    updateAlertStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/inventory-movements/smart-alerts/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['SmartAlerts'],
    }),

    // تصدير البيانات
    exportInventoryMovements: builder.mutation({
      query: (params) => ({
        url: '/inventory-movements/export',
        method: 'POST',
        body: params,
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `inventory_movements_${new Date().toISOString().split('T')[0]}.csv`;
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
  useGetInventoryMovementsQuery,
  useGetInventoryMovementByIdQuery,
  useCreateInventoryMovementMutation,
  useUpdateInventoryMovementMutation,
  useDeleteInventoryMovementMutation,
  useGetInventoryMovementStatisticsQuery,
  useGetAIInsightsQuery,
  useGetSmartAlertsQuery,
  useUpdateAlertStatusMutation,
  useExportInventoryMovementsMutation,
} = inventoryMovementApi;
