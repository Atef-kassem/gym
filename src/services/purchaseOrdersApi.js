import { apiSlice } from "./apiSlice";

export const purchaseOrdersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseOrders: builder.query({
      query: (params = {}) => ({ url: "/purchase-orders", params }),
    }),
    createPurchaseOrder: builder.mutation({
      query: (body) => ({ url: "/purchase-orders", method: "POST", body }),
    }),
    getPurchaseOrder: builder.query({
      query: (id) => ({ url: `/purchase-orders/${id}` }),
    }),
    updatePurchaseOrder: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/purchase-orders/${id}`, method: "PUT", body }),
    }),
  }),
});

export const {
  useListPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useGetPurchaseOrderQuery,
  useUpdatePurchaseOrderMutation,
} = purchaseOrdersApi;


