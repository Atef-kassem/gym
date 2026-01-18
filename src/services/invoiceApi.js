import { apiSlice } from "./apiSlice";

export const invoiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseInvoices: builder.query({
      query: (params = {}) => ({ url: "/purchase-invoices", params }),
      providesTags: ["PurchaseInvoice"],
    }),
    getPurchaseInvoice: builder.query({
      query: (id) => ({ url: `/purchase-invoices/${id}` }),
      providesTags: (r, e, id) => [{ type: "PurchaseInvoice", id }],
    }),
    createPurchaseInvoice: builder.mutation({
      query: (body) => ({ url: "/purchase-invoices", method: "POST", body }),
      invalidatesTags: ["PurchaseInvoice"],
    }),
    updatePurchaseInvoice: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/purchase-invoices/${id}`, method: "PUT", body }),
      invalidatesTags: (r, e, { id }) => [{ type: "PurchaseInvoice", id }, "PurchaseInvoice"],
    }),
    matchPurchaseInvoice: builder.mutation({
      query: (id) => ({ url: `/purchase-invoices/${id}/match`, method: "POST" }),
      invalidatesTags: (r, e, id) => [{ type: "PurchaseInvoice", id }, "PurchaseInvoice"],
    }),
    deletePurchaseInvoice: builder.mutation({
      query: (id) => ({ url: `/purchase-invoices/${id}`, method: "DELETE" }),
      invalidatesTags: ["PurchaseInvoice"],
    }),
  }),
});

export const {
  useListPurchaseInvoicesQuery,
  useGetPurchaseInvoiceQuery,
  useCreatePurchaseInvoiceMutation,
  useUpdatePurchaseInvoiceMutation,
  useMatchPurchaseInvoiceMutation,
  useDeletePurchaseInvoiceMutation,
} = invoiceApi;


