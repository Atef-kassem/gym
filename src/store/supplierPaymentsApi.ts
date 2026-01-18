import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SupplierPayment {
  id: string;
  supplier_id: number;
  supplierName?: string;
  invoice_id?: number;
  invoiceNumber?: string;
  paymentNumber: string;
  paymentAmount: number;
  paymentDate: string;
  dueDate?: string;
  paymentMethod: string;
  transferNumber?: string;
  bankAccount?: string;
  notes?: string;
  status: 'مدفوع' | 'جزئي' | 'معلق' | 'متأخر';
  priority: 'عادي' | 'عالي' | 'عاجل';
  currency: string;
  exchangeRate?: number;
  remainingAmount: number;
  approvedBy?: string;
  approvedAt?: string;
  isRecurring: boolean;
  recurringInterval?: string;
  nextPaymentDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierPaymentRequest {
  supplier_id: number;
  invoice_id?: number;
  paymentAmount: number;
  paymentDate: string;
  dueDate?: string;
  paymentMethod: string;
  transferNumber?: string;
  bankAccount?: string;
  notes?: string;
  status: 'مدفوع' | 'جزئي' | 'معلق' | 'متأخر';
  priority: 'عادي' | 'عالي' | 'عاجل';
  currency: string;
  exchangeRate?: number;
  isRecurring?: boolean;
  recurringInterval?: string;
  nextPaymentDate?: string;
}

export interface UpdateSupplierPaymentRequest extends Partial<CreateSupplierPaymentRequest> {
  id: string;
}

export const supplierPaymentsApi = createApi({
  reducerPath: 'supplierPaymentsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://metagym.metacodecx.com/api/v1/',
    credentials: 'include'
  }),
  tagTypes: ['SupplierPayment'],
  endpoints: (builder) => ({
    getSupplierPayments: builder.query<{ status: string; results: number; data: SupplierPayment[] }, { 
      supplier_id?: number; 
      status?: string; 
      method?: string; 
      q?: string 
    }>({
      query: (params) => ({
        url: 'supplier-payments-core',
        params,
      }),
      providesTags: ['SupplierPayment'],
    }),

    getSupplierPayment: builder.query<{ status: string; data: SupplierPayment }, string>({
      query: (id) => `supplier-payments-core/${id}`,
      providesTags: (result, error, id) => [{ type: 'SupplierPayment', id }],
    }),

    createSupplierPayment: builder.mutation<{ status: string; data: SupplierPayment }, CreateSupplierPaymentRequest>({
      query: (payment) => ({
        url: 'supplier-payments-core',
        method: 'POST',
        body: payment,
      }),
      invalidatesTags: ['SupplierPayment'],
    }),

    updateSupplierPayment: builder.mutation<{ status: string; data: SupplierPayment }, UpdateSupplierPaymentRequest>({
      query: ({ id, ...patch }) => ({
        url: `supplier-payments-core/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SupplierPayment', id }],
    }),

    deleteSupplierPayment: builder.mutation<void, string>({
      query: (id) => ({
        url: `supplier-payments-core/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupplierPayment'],
    }),
  }),
});

export const {
  useGetSupplierPaymentsQuery,
  useGetSupplierPaymentQuery,
  useCreateSupplierPaymentMutation,
  useUpdateSupplierPaymentMutation,
  useDeleteSupplierPaymentMutation,
} = supplierPaymentsApi;
