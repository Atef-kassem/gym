import { apiSlice } from './apiSlice';

export const supplierReportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // جلب تقارير الموردين
    getSupplierReports: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryParams.append('dateTo', params.dateTo);
        if (params.category) queryParams.append('category', params.category);
        if (params.status) queryParams.append('status', params.status);
        if (params.search) queryParams.append('search', params.search);
        
        return {
          url: `/supplier-dashboard/reports?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['SupplierReports'],
    }),

    // جلب إحصائيات تقارير الموردين
    getSupplierReportStats: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryParams.append('dateTo', params.dateTo);
        if (params.category) queryParams.append('category', params.category);
        if (params.status) queryParams.append('status', params.status);
        
        return {
          url: `/supplier-dashboard/reports/stats?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['SupplierReportStats'],
    }),

    // جلب تقرير الأداء
    getSupplierPerformanceReport: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryParams.append('dateTo', params.dateTo);
        if (params.category) queryParams.append('category', params.category);
        
        return {
          url: `/supplier-dashboard/reports/performance?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['SupplierPerformanceReport'],
    }),

    // جلب تقرير المدفوعات
    getSupplierPaymentsReport: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryParams.append('dateTo', params.dateTo);
        if (params.status) queryParams.append('status', params.status);
        
        return {
          url: `/supplier-dashboard/reports/payments?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['SupplierPaymentsReport'],
    }),

    // جلب تقرير الطلبيات
    getSupplierOrdersReport: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryParams.append('dateTo', params.dateTo);
        if (params.category) queryParams.append('category', params.category);
        
        return {
          url: `/supplier-dashboard/reports/orders?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['SupplierOrdersReport'],
    }),

    // جلب تقرير الشكاوى والمرتجعات
    getSupplierComplaintsReport: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryParams.append('dateTo', params.dateTo);
        if (params.category) queryParams.append('category', params.category);
        
        return {
          url: `/supplier-dashboard/reports/complaints?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['SupplierComplaintsReport'],
    }),

    // جلب تقرير المخاطر
    getSupplierRisksReport: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryParams.append('dateTo', params.dateTo);
        if (params.riskLevel) queryParams.append('riskLevel', params.riskLevel);
        
        return {
          url: `/supplier-dashboard/reports/risks?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['SupplierRisksReport'],
    }),

    // تصدير تقرير
    exportSupplierReport: builder.mutation({
      query: ({ type, params, format = 'xlsx' }) => ({
        url: `/supplier-dashboard/reports/export`,
        method: 'POST',
        body: {
          type,
          params,
          format,
        },
        responseHandler: (response) => {
          const filename = `supplier_report_${type}_${new Date().toISOString().split('T')[0]}.${format}`;
          response.blob().then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          });
          return response;
        },
      }),
      invalidatesTags: ['SupplierReports'],
    }),
  }),
});

export const {
  useGetSupplierReportsQuery,
  useGetSupplierReportStatsQuery,
  useGetSupplierPerformanceReportQuery,
  useGetSupplierPaymentsReportQuery,
  useGetSupplierOrdersReportQuery,
  useGetSupplierComplaintsReportQuery,
  useGetSupplierRisksReportQuery,
  useExportSupplierReportMutation,
} = supplierReportsApi;
