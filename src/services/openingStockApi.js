import { apiSlice } from "./apiSlice";

export const openingStockApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all opening stocks
    getAllOpeningStocks: builder.query({
      query: () => "/opening-stocks",
      providesTags: ["OpeningStock"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.warn("Opening stocks API error:", error);
        }
      },
    }),

    // Get opening stock by ID
    getOpeningStockById: builder.query({
      query: (id) => `/opening-stocks/${id}`,
      providesTags: (result, error, id) => [{ type: "OpeningStock", id }],
    }),

    // Get opening stocks by branch
    getOpeningStocksByBranch: builder.query({
      query: (branchId) => `/opening-stocks/branch/${branchId}`,
      providesTags: (result, error, branchId) => [
        { type: "OpeningStock", branchId },
      ],
    }),

    // Get opening stocks by warehouse
    getOpeningStocksByWarehouse: builder.query({
      query: (warehouseId) => `/opening-stocks/warehouse/${warehouseId}`,
      providesTags: (result, error, warehouseId) => [
        { type: "OpeningStock", warehouseId },
      ],
    }),

    // Get opening stocks with pagination
    getOpeningStocksPaginated: builder.query({
      query: ({ page = 1, limit = 100000000 } = {}) => ({
        url: "/opening-stocks/paginated/list",
        params: { page, limit },
      }),
      providesTags: ["OpeningStock"],
    }),

    // Create opening stock
    createOpeningStock: builder.mutation({
      query: (openingStock) => ({
        url: "/opening-stocks",
        method: "POST",
        body: openingStock,
      }),
      invalidatesTags: ["OpeningStock"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log("Opening stock created successfully:", result);
        } catch (error) {
          console.warn("Create opening stock API error:", error);
        }
      },
    }),

    // Update opening stock
    updateOpeningStock: builder.mutation({
      query: ({ id, ...openingStock }) => ({
        url: `/opening-stocks/${id}`,
        method: "PUT",
        body: openingStock,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "OpeningStock", id },
      ],
    }),

    // Delete opening stock
    deleteOpeningStock: builder.mutation({
      query: (id) => ({
        url: `/opening-stocks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OpeningStock"],
    }),
  }),
});

export const {
  useGetAllOpeningStocksQuery,
  useGetOpeningStockByIdQuery,
  useGetOpeningStocksByBranchQuery,
  useGetOpeningStocksByWarehouseQuery,
  useGetOpeningStocksPaginatedQuery,
  useCreateOpeningStockMutation,
  useUpdateOpeningStockMutation,
  useDeleteOpeningStockMutation,
} = openingStockApi;
