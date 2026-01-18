import { apiSlice } from "./apiSlice";

export const supplierPaymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listSupplierPayments: builder.query({
      query: (params = {}) => ({ url: "/supplier-payments", params }),
      providesTags: ["SupplierPayment"],
    }),
    createSupplierPayment: builder.mutation({
      query: (body) => ({ url: "/supplier-payments", method: "POST", body }),
      invalidatesTags: ["SupplierPayment", "PurchaseInvoice"],
    }),
    updateSupplierPayment: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/supplier-payments/${id}`, method: "PUT", body }),
      invalidatesTags: (r, e, { id }) => [{ type: "SupplierPayment", id }, "SupplierPayment", "PurchaseInvoice"],
    }),
    deleteSupplierPayment: builder.mutation({
      query: (id) => ({ url: `/supplier-payments/${id}`, method: "DELETE" }),
      invalidatesTags: ["SupplierPayment", "PurchaseInvoice"],
    }),
  }),
});

export const {
  useListSupplierPaymentsQuery,
  useCreateSupplierPaymentMutation,
  useUpdateSupplierPaymentMutation,
  useDeleteSupplierPaymentMutation,
} = supplierPaymentsApi;


