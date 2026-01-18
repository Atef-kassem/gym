import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const manufacturersApi = createApi({
  reducerPath: 'manufacturersApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE_URL}/api/v1`,
    credentials: 'include',
  }),
  tagTypes: ['Manufacturer'],
  endpoints: (builder) => ({
    // List manufacturers
    getAllManufacturers: builder.query({
      query: (params) => ({
        url: '/manufacturers',
        params,
      }),
      providesTags: ['Manufacturer'],
    }),

    // Get one manufacturer
    getManufacturerById: builder.query({
      query: (id) => `/manufacturers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Manufacturer', id }],
    }),

    // Create manufacturer
    createManufacturer: builder.mutation({
      query: (data) => ({
        url: '/manufacturers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Manufacturer'],
    }),

    // Update manufacturer
    updateManufacturer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/manufacturers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Manufacturer', id }, 'Manufacturer'],
    }),

    // Delete manufacturer
    deleteManufacturer: builder.mutation({
      query: (id) => ({
        url: `/manufacturers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Manufacturer'],
    }),
  }),
});

export const {
  useGetAllManufacturersQuery,
  useGetManufacturerByIdQuery,
  useCreateManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,
} = manufacturersApi;
