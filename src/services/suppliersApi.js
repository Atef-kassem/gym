// src/services/suppliersApi.js
import { apiSlice } from "./apiSlice";

export const suppliersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSuppliers: builder.query({
      query: () => "/suppliers",
      providesTags: ["Supplier"],
      // Add error handling for when backend is not available
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.warn("Suppliers API error, using mock data:", error);
          // Try to get mock data as fallback
          try {
            await dispatch(apiSlice.endpoints.getMockSuppliers.initiate());
          } catch (mockError) {
            console.warn("Mock suppliers also failed:", mockError);
          }
        }
      },
    }),
    createSupplier: builder.mutation({
      query: (supplier) => ({
        url: "/suppliers",
        method: "POST",
        body: supplier,
      }),
      invalidatesTags: ["Supplier"],
      // Add error handling for when backend is not available
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("Supplier created successfully:", result);
        } catch (error) {
          console.warn("Create supplier API error:", error);
          // If backend is not available, we can't create suppliers
          // This is handled by the mock data in apiSlice
        }
      },
    }),
    updateSupplier: builder.mutation({
      query: ({ id, ...supplier }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        body: supplier,
      }),
      invalidatesTags: ["Supplier"],
    }),
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useGetAllSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
