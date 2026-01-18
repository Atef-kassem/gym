import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation({
      query: (newProduct) => {
        // إذا كان FormData، لا نضع headers (سيتم تعيينها تلقائياً)
        const isFormData = newProduct instanceof FormData;
        
        return {
          url: "/products",
          method: "POST",
          body: newProduct,
          // لا نضع Content-Type للـ FormData
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, updatedProduct }) => {
        // إذا كان FormData، لا نضع headers (سيتم تعيينها تلقائياً)
        const isFormData = updatedProduct instanceof FormData;
        
        return {
          url: `/products/${id}`,
          method: "PATCH",
          body: updatedProduct,
          // لا نضع Content-Type للـ FormData
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Product",
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProductStock: builder.mutation({
      query: ({ id, warehouseId, quantity }) => ({
        url: `/products/${id}/stock`,
        method: "PUT",
        body: { warehouseId, quantity },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Product",
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductStockMutation,
} = productApi;
