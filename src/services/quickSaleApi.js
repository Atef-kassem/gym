import { apiSlice } from "./apiSlice";

export const quickSaleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // جلب جميع المبيعات السريعة
    getAllQuickSales: builder.query({
      query: (params = {}) => {
        // إزالة القيم undefined
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined)
        );
        const queryString = new URLSearchParams(cleanParams).toString();
        const url = `/quick-sales${queryString ? `?${queryString}` : ''}`;
        console.log("🔍 QuickSale API - Calling:", url, cleanParams);
        return url;
      },
      providesTags: ["QuickSale"],
      transformResponse: (response) => {
        console.log("🔍 QuickSale API - Response:", response);
        return response;
      },
    }),
    
    // جلب بيع محدد
    getQuickSaleById: builder.query({
      query: (id) => `/quick-sales/${id}`,
      providesTags: (result, error, id) => [{ type: "QuickSale", id }],
    }),
    
    // إنشاء بيع سريع جديد
    createQuickSale: builder.mutation({
      query: (saleData) => ({
        url: "/quick-sales",
        method: "POST",
        body: saleData,
      }),
      invalidatesTags: ["QuickSale"],
    }),
    
    // تحديث بيع (للإرجاع أو الإلغاء)
    updateQuickSale: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/quick-sales/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "QuickSale", id },
        "QuickSale",
      ],
    }),
    
    // جلب الإحصائيات
    getQuickSaleStats: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/quick-sales/stats/summary${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ["QuickSaleStats"],
    }),
    
    // تحديث حالة الطباعة
    markQuickSaleAsPrinted: builder.mutation({
      query: (id) => ({
        url: `/quick-sales/${id}/print`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "QuickSale", id }],
    }),
  }),
});

export const {
  useGetAllQuickSalesQuery,
  useGetQuickSaleByIdQuery,
  useCreateQuickSaleMutation,
  useUpdateQuickSaleMutation,
  useGetQuickSaleStatsQuery,
  useMarkQuickSaleAsPrintedMutation,
} = quickSaleApi;
