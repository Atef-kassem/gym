import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Supplier {
  supplier_id: number;
  name_ar: string;
  name_en?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_number?: string;
  commercial_number?: string;
  contact_person?: string;
  payment_terms?: string;
  credit_limit?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const suppliersApi = createApi({
  reducerPath: 'suppliersApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://metagym.metacodecx.com/api/v1/',
    credentials: 'include'
  }),
  tagTypes: ['Supplier'],
  endpoints: (builder) => ({
    getSuppliers: builder.query<{ status: string; results: number; data: Supplier[] }, { q?: string }>({
      query: (params) => ({
        url: 'suppliers-core',
        params,
      }),
      providesTags: ['Supplier'],
    }),

    getSupplier: builder.query<{ status: string; data: Supplier }, number>({
      query: (id) => `suppliers-core/${id}`,
      providesTags: (result, error, id) => [{ type: 'Supplier', id }],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierQuery,
} = suppliersApi;
