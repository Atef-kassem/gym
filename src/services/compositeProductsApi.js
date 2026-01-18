import { apiSlice } from "./apiSlice";

export const compositeProductsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCompositeProduct: builder.mutation({
      query: (newCompositeProduct) => ({
        url: "/compositeProducts",
        method: "POST",
        body: newCompositeProduct,
      }),
      invalidatesTags: ["CompositeProduct"],
    }),
    getAllCompositeProducts: builder.query({
      query: () => "/compositeProducts",
      providesTags: ["CompositeProduct"],
    }),
    getCompositeProductById: builder.query({
      query: (id) => `/compositeProducts/${id}`,
      providesTags: (result, error, id) => [{ type: "CompositeProduct", id }],
    }),
    updateCompositeProduct: builder.mutation({
      query: ({ id, updatedCompositeProduct }) => ({
        url: `/compositeProducts/${id}`,
        method: "PUT",
        body: updatedCompositeProduct,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CompositeProduct", id },
        "CompositeProduct",
      ],
    }),
    deleteCompositeProduct: builder.mutation({
      query: (id) => ({
        url: `/compositeProducts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompositeProduct"],
    }),
  }),
});

export const {
  useCreateCompositeProductMutation,
  useGetAllCompositeProductsQuery,
  useGetCompositeProductByIdQuery,
  useUpdateCompositeProductMutation,
  useDeleteCompositeProductMutation,
} = compositeProductsApi;
