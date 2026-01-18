import { apiSlice } from "./apiSlice";

export const inventoryTransactionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // جلب جميع الحركات المخزنية
    getAllTransactions: builder.query({
      query: (params = {}) => ({
        url: "/inventory-transactions",
        params: {
          page: params.page || 1,
          limit: params.limit || 50,
          type: params.type,
          status: params.status,
          branchId: params.branchId,
          warehouseId: params.warehouseId,
          userId: params.userId,
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
          search: params.search,
        },
      }),
      transformResponse: (response) => {
        if (response?.data?.transactions) {
          response.data.transactions = response.data.transactions.map(t => ({
            ...t,
            sourceWarehouse: t.sourceWarehouseId || t.source_warehouse_id,
            targetWarehouse: t.targetWarehouseId || t.target_warehouse_id,
            sourceWarehouseName: t.sourceWarehouseName || t.source_warehouse_name,
            targetWarehouseName: t.targetWarehouseName || t.target_warehouse_name,
          }));
        }
        return response;
      },
      providesTags: (result) => [
        { type: "InventoryTransaction", id: "LIST" },
        ...(result?.transactions || []).map((t) => ({ type: "InventoryTransaction", id: t.id })),
      ],
    }),

    // جلب حركة مخزنية واحدة
    getTransactionById: builder.query({
      query: (id) => `/inventory-transactions/${id}`,
      transformResponse: (response) => {
        if (response?.data) {
          const t = response.data;
          response.data = {
            ...t,
            sourceWarehouse: t.sourceWarehouseId || t.source_warehouse_id,
            targetWarehouse: t.targetWarehouseId || t.target_warehouse_id,
            sourceWarehouseName: t.sourceWarehouseName || t.source_warehouse_name,
            targetWarehouseName: t.targetWarehouseName || t.target_warehouse_name,
          };
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: "InventoryTransaction", id }],
    }),

    // إنشاء حركة مخزنية جديدة
    createTransaction: builder.mutation({
      query: (transactionData) => ({
        url: "/inventory-transactions",
        method: "POST",
        body: transactionData,
      }),
      invalidatesTags: [{ type: "InventoryTransaction", id: "LIST" }],
    }),

    // تحديث حركة مخزنية
    updateTransaction: builder.mutation({
      query: ({ id, transactionData }) => ({
        url: `/inventory-transactions/${id}`,
        method: "PUT",
        body: transactionData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InventoryTransaction", id },
        { type: "InventoryTransaction", id: "LIST" },
      ],
    }),

    // حذف حركة مخزنية
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/inventory-transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "InventoryTransaction", id: "LIST" }],
    }),

    // اعتماد حركة مخزنية
    approveTransaction: builder.mutation({
      query: (id) => ({
        url: `/inventory-transactions/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "InventoryTransaction", id },
        { type: "InventoryTransaction", id: "LIST" },
      ],
    }),

    // رفض حركة مخزنية
    rejectTransaction: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/inventory-transactions/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InventoryTransaction", id },
        { type: "InventoryTransaction", id: "LIST" },
      ],
    }),

    // جلب إحصائيات الحركات المخزنية
    getTransactionStats: builder.query({
      query: (params = {}) => ({
        url: "/inventory-transactions/stats",
        params: {
          branchId: params.branchId,
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
        },
      }),
      providesTags: ["TransactionStats"],
    }),

    // جلب أنواع الحركات
    getTransactionTypes: builder.query({
      query: () => "/inventory-transactions/types",
      providesTags: ["TransactionTypes"],
    }),

    // جلب وحدات القياس
    getUnits: builder.query({
      query: () => "/inventory-transactions/units",
      providesTags: ["Units"],
    }),

    // البحث في المنتجات
    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: "/products/search",
        params: { q: searchTerm },
      }),
      providesTags: (result) => [
        { type: "Product", id: "SEARCH" },
        ...(result?.products || []).map((p) => ({ type: "Product", id: p.id })),
      ],
    }),

    // جلب المستودعات حسب الفرع
    getWarehousesByBranch: builder.query({
      query: (branchId) => `/branches/${branchId}/storages`,
      providesTags: (result, error, branchId) => [
        { type: "Warehouse", id: `branch-${branchId}` },
      ],
    }),

    // جلب المستخدمين
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useApproveTransactionMutation,
  useRejectTransactionMutation,
  useGetTransactionStatsQuery,
  useGetTransactionTypesQuery,
  useGetUnitsQuery,
  useSearchProductsQuery,
  useGetWarehousesByBranchQuery,
  useGetUsersQuery,
} = inventoryTransactionsApi;
