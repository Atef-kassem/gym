import { apiSlice } from "./apiSlice";

export const inventoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createInventory: builder.mutation({
      query: (newInventory) => ({
        url: "/inventory",
        method: "POST",
        body: newInventory,
      }),
      invalidatesTags: ["Inventory"],
    }),
    getInventoryById: builder.query({
      query: (inventoryId) => `/inventory/${inventoryId}`,
      providesTags: (result, error, inventoryId) => [
        { type: "Inventory", id: inventoryId },
      ],
    }),
    getInventoryByProductAndWarehouse: builder.query({
      query: ({ productId, warehouseId }) =>
        `/inventory/product/${productId}/warehouse/${warehouseId}`,
      providesTags: (result, error, { productId, warehouseId }) => [
        { type: "Inventory", id: `${productId}-${warehouseId}` },
      ],
    }),
    getAllInventory: builder.query({
      query: () => "/inventory",
      providesTags: ["Inventory"],
    }),
    updateStock: builder.mutation({
      query: ({ productId, warehouseId, quantity, operation_type, notes }) => ({
        url: `/inventory/stock/product/${productId}/warehouse/${warehouseId}`,
        method: "PUT",
        body: { quantity, operation_type, notes },
      }),
      invalidatesTags: (result, error, { productId, warehouseId }) => [
        { type: "Inventory", id: `${productId}-${warehouseId}` },
        "Inventory",
      ],
    }),
    setStock: builder.mutation({
      query: ({ productId, warehouseId, newStock }) => ({
        url: `/inventory/set-stock/product/${productId}/warehouse/${warehouseId}`,
        method: "PUT",
        body: newStock,
      }),
      invalidatesTags: (result, error, { productId, warehouseId }) => [
        { type: "Inventory", id: `${productId}-${warehouseId}` },
        "Inventory",
      ],
    }),
    updateInventorySettings: builder.mutation({
      query: ({ productId, warehouseId, settings }) => ({
        url: `/inventory/settings/product/${productId}/warehouse/${warehouseId}`,
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: (result, error, { productId, warehouseId }) => [
        { type: "Inventory", id: `${productId}-${warehouseId}` },
        "Inventory",
      ],
    }),
    getLowStockAlerts: builder.query({
      query: () => "/inventory/low-stock",
      providesTags: ["Inventory"],
    }),
    getStockLevelsByWarehouse: builder.query({
      query: (warehouseId) => `/inventory/stock-levels/${warehouseId}`,
      providesTags: (result, error, warehouseId) => [
        { type: "Inventory", id: `warehouse-${warehouseId}` },
      ],
    }),
    deleteInventory: builder.mutation({
      query: (inventoryId) => ({
        url: `/inventory/${inventoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useCreateInventoryMutation,
  useGetInventoryByIdQuery,
  useGetInventoryByProductAndWarehouseQuery,
  useGetAllInventoryQuery,
  useUpdateStockMutation,
  useSetStockMutation,
  useUpdateInventorySettingsMutation,
  useGetLowStockAlertsQuery,
  useGetStockLevelsByWarehouseQuery,
  useDeleteInventoryMutation,
} = inventoryApi;
