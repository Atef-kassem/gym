import { apiSlice } from "./apiSlice";

export const consumableApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllConsumables: builder.query({
      query: () => "/consumables",
      providesTags: ["Consumable"],
    }),
    getConsumableById: builder.query({
      query: (id) => `/consumables/${id}`,
      providesTags: (result, error, id) => [{ type: "Consumable", id }],
    }),
    createConsumable: builder.mutation({
      query: (newConsumable) => {
        // إذا كان FormData، لا نضع headers (سيتم تعيينها تلقائياً)
        const isFormData = newConsumable instanceof FormData;
        
        return {
          url: "/consumables",
          method: "POST",
          body: newConsumable,
          // لا نضع Content-Type للـ FormData
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: ["Consumable"],
    }),
    updateConsumable: builder.mutation({
      query: ({ id, updatedConsumable }) => {
        // إذا كان FormData، لا نضع headers (سيتم تعيينها تلقائياً)
        const isFormData = updatedConsumable instanceof FormData;
        
        return {
          url: `/consumables/${id}`,
          method: "PATCH",
          body: updatedConsumable,
          // لا نضع Content-Type للـ FormData
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Consumable", id },
        "Consumable",
      ],
    }),
    deleteConsumable: builder.mutation({
      query: (id) => ({
        url: `/consumables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Consumable"],
    }),
    updateConsumableStock: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/consumables/${id}/set-stock`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Consumable", id },
        "Consumable",
      ],
    }),
  }),
});

export const {
  useGetAllConsumablesQuery,
  useGetConsumableByIdQuery,
  useCreateConsumableMutation,
  useUpdateConsumableMutation,
  useDeleteConsumableMutation,
  useUpdateConsumableStockMutation,
} = consumableApi;
