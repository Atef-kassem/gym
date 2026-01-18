import { apiSlice } from "./apiSlice";

export const sparePartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all spare parts with pagination and filtering
    getAllSpareParts: builder.query({
      query: (params = {}) => ({
        url: "/spare-parts",
        params,
      }),
      providesTags: ["SparePart"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.warn("Spare parts API error:", error);
        }
      },
    }),

    // Get spare part by ID
    getSparePartById: builder.query({
      query: (id) => `/spare-parts/${id}`,
      providesTags: (result, error, id) => [{ type: "SparePart", id }],
    }),

    // Get spare part by code
    getSparePartByCode: builder.query({
      query: (code) => `/spare-parts/code/${code}`,
      providesTags: (result, error, code) => [{ type: "SparePart", code }],
    }),

    // Get low stock items
    getLowStockItems: builder.query({
      query: (branchId) => ({
        url: "/spare-parts/low-stock",
        params: branchId ? { branch_Id: branchId } : {},
      }),
      providesTags: ["SparePart"],
    }),

    // Create spare part
    createSparePart: builder.mutation({
      query: (sparePart) => ({
        url: "/spare-parts",
        method: "POST",
        body: sparePart,
      }),
      invalidatesTags: ["SparePart"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log("Spare part created successfully:", result);
        } catch (error) {
          console.warn("Create spare part API error:", error);
        }
      },
    }),

    // Update spare part
    updateSparePart: builder.mutation({
      query: ({ id, ...sparePart }) => ({
        url: `/spare-parts/${id}`,
        method: "PUT",
        body: sparePart,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SparePart", id }],
    }),

    // Delete spare part
    deleteSparePart: builder.mutation({
      query: (id) => ({
        url: `/spare-parts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SparePart"],
    }),

    // Update stock quantity
    updateStock: builder.mutation({
      query: ({ id, quantity, operation }) => ({
        url: `/spare-parts/${id}/stock`,
        method: "PUT",
        body: { quantity, operation },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SparePart", id }],
    }),
  }),
});

export const {
  useGetAllSparePartsQuery,
  useGetSparePartByIdQuery,
  useGetSparePartByCodeQuery,
  useGetLowStockItemsQuery,
  useCreateSparePartMutation,
  useUpdateSparePartMutation,
  useDeleteSparePartMutation,
  useUpdateStockMutation,
} = sparePartApi;
