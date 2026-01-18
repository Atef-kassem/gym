import { apiSlice } from "./apiSlice";

export const productBranchesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductBranches: builder.query({
      query: () => "/productbranches",
      providesTags: ["ProductBranch"],
    }),
    createProductBranch: builder.mutation({
      query: (newProductBranch) => ({
        url: "/productbranches",
        method: "POST",
        body: newProductBranch,
      }),
      invalidatesTags: ["ProductBranch"],
    }),
    getProductBranch: builder.query({
      query: ({ productId, branchId }) =>
        `/productbranches/${productId}/${branchId}`,
      providesTags: (result, error, { productId, branchId }) => [
        { type: "ProductBranch", id: `${productId}-${branchId}` },
      ],
    }),
    updateProductBranch: builder.mutation({
      query: ({ productId, branchId, updatedProductBranch }) => ({
        url: `/productbranches/${productId}/${branchId}`,
        method: "PATCH",
        body: updatedProductBranch,
      }),
      invalidatesTags: (result, error, { productId, branchId }) => [
        { type: "ProductBranch", id: `${productId}-${branchId}` },
        "ProductBranch",
      ],
    }),
    deleteProductBranch: builder.mutation({
      query: ({ productId, branchId }) => ({
        url: `/productbranches/${productId}/${branchId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductBranch"],
    }),
    updateProductBranchStock: builder.mutation({
      query: ({ productId, branchId, stockUpdate }) => ({
        url: `/productbranches/${productId}/${branchId}/stock`,
        method: "PATCH",
        body: stockUpdate,
      }),
      invalidatesTags: (result, error, { productId, branchId }) => [
        { type: "ProductBranch", id: `${productId}-${branchId}` },
      ],
    }),
    getProductsByBranch: builder.query({
      query: (branchId) => `/productbranches/branch/${branchId}/products`,
      providesTags: (result, error, branchId) => [
        { type: "ProductBranch", id: `branch-${branchId}` },
      ],
    }),
    getLowStockItemsByBranch: builder.query({
      query: (branchId) => `/productbranches/branch/${branchId}/low-stock`,
      providesTags: (result, error, branchId) => [
        { type: "ProductBranch", id: `branch-low-stock-${branchId}` },
      ],
    }),
    getBranchesByProduct: builder.query({
      query: (productId) => `/productbranches/product/${productId}/branches`,
      providesTags: (result, error, productId) => [
        { type: "ProductBranch", id: `product-${productId}` },
      ],
    }),
  }),
});

export const {
  useGetAllProductBranchesQuery,
  useCreateProductBranchMutation,
  useGetProductBranchQuery,
  useUpdateProductBranchMutation,
  useDeleteProductBranchMutation,
  useUpdateProductBranchStockMutation,
  useGetProductsByBranchQuery,
  useGetLowStockItemsByBranchQuery,
  useGetBranchesByProductQuery,
} = productBranchesApi;
