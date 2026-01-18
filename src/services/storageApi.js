import { apiSlice } from "./apiSlice";

export const storageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStorages: builder.query({
      query: () => "/storages",
      providesTags: ["Storage"],
      // Add error handling for when backend is not available
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.warn("Storages API error:", error);
        }
      },
    }),
    createStorage: builder.mutation({
      query: (storage) => ({
        url: "/storages",
        method: "POST",
        body: storage,
      }),
      invalidatesTags: ["Storage"],
      // Add error handling for when backend is not available
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("Storage created successfully:", result);
        } catch (error) {
          console.warn("Create storage API error:", error);
          // If backend is not available, we can't create storages
          // This is handled by the mock data in apiSlice
        }
      },
    }),
    updateStorage: builder.mutation({
      query: ({ id, ...storage }) => ({
        url: `/storages/${id}`,
        method: "PUT",
        body: storage,
      }),
      invalidatesTags: ["Storage"],
    }),
    deleteStorage: builder.mutation({
      query: (id) => ({
        url: `/storages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Storage"],
    }),
  }),
});

export const {
  useGetAllStoragesQuery,
  useCreateStorageMutation,
  useUpdateStorageMutation,
  useDeleteStorageMutation,
} = storageApi;
