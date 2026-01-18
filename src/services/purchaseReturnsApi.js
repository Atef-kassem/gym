import { apiSlice } from "./apiSlice";

export const purchaseReturnsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseReturns: builder.query({
      query: (params = {}) => ({ url: "/purchase-returns", params }),
      providesTags: ["PurchaseReturn"],
    }),
    getPurchaseReturn: builder.query({
      query: (id) => ({ url: `/purchase-returns/${id}` }),
      providesTags: (r, e, id) => [{ type: "PurchaseReturn", id }],
    }),
    createPurchaseReturn: builder.mutation({
      query: (body) => ({ url: "/purchase-returns", method: "POST", body }),
      invalidatesTags: ["PurchaseReturn"],
    }),
    updatePurchaseReturn: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/purchase-returns/${id}`, method: "PUT", body }),
      invalidatesTags: (r, e, { id }) => [{ type: "PurchaseReturn", id }, "PurchaseReturn"],
    }),
  }),
});

export const {
  useListPurchaseReturnsQuery,
  useGetPurchaseReturnQuery,
  useCreatePurchaseReturnMutation,
  useUpdatePurchaseReturnMutation,
} = purchaseReturnsApi;


