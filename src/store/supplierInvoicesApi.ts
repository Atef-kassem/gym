import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SupplierInvoice {
  id: string;
  supplier_id: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const supplierInvoicesApi = createApi({
  reducerPath: 'supplierInvoicesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://metagym.metacodecx.com/api/v1/',
    credentials: 'include'
  }),
  tagTypes: ['SupplierInvoice'],
  endpoints: (builder) => ({
    getSupplierInvoices: builder.query<{ status: string; results: number; data: SupplierInvoice[] }, { supplier_id?: number; status?: string; q?: string }>({
      query: (params) => ({ url: 'supplier-invoices', params }),
      providesTags: ['SupplierInvoice'],
    }),
    getSupplierInvoice: builder.query<{ status: string; data: SupplierInvoice }, string>({
      query: (id) => `supplier-invoices/${id}`,
      providesTags: (r, e, id) => [{ type: 'SupplierInvoice', id }],
    })
  }),
});

export const { useGetSupplierInvoicesQuery, useGetSupplierInvoiceQuery } = supplierInvoicesApi;
