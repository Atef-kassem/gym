import { apiSlice } from "./apiSlice";

export const warehouseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllWarehouses: builder.query({
      query: () => "/warehouses",
      providesTags: ["Warehouse"],
    }),
    createWarehouse: builder.mutation({
      query: (newWarehouse) => ({
        url: "/warehouses",
        method: "POST",
        body: newWarehouse,
      }),
      invalidatesTags: ["Warehouse"],
    }),
    getWarehouse: builder.query({
      query: (id) => `/warehouses/${id}`,
      providesTags: (result, error, id) => [{ type: "Warehouse", id }],
    }),
    updateWarehouse: builder.mutation({
      query: ({ id, updatedWarehouse }) => ({
        url: `/warehouses/${id}`,
        method: "PATCH",
        body: updatedWarehouse,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Warehouse", id },
        "Warehouse",
      ],
    }),
    deleteWarehouse: builder.mutation({
      query: (id) => ({
        url: `/warehouses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Warehouse"],
    }),
    getWarehouseInventory: builder.query({
      query: (id) => `/warehouses/${id}/inventory`,
      providesTags: (result, error, id) => [
        { type: "Inventory", id: `warehouse-${id}` },
      ],
    }),
    updateWarehouseInventory: builder.mutation({
      query: ({ warehouseId, inventoryId, updatedInventory }) => ({
        url: `/warehouses/${warehouseId}/inventory/${inventoryId}`,
        method: "PATCH",
        body: updatedInventory,
      }),
      invalidatesTags: (result, error, { warehouseId, inventoryId }) => [
        { type: "Inventory", id: `warehouse-${warehouseId}` },
        { type: "Inventory", id: inventoryId },
      ],
    }),
  }),
});

export const {
  useGetAllWarehousesQuery,
  useCreateWarehouseMutation,
  useGetWarehouseQuery,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetWarehouseInventoryQuery,
  useUpdateWarehouseInventoryMutation,
} = warehouseApi;
