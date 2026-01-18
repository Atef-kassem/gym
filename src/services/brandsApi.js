import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const brandsApi = createApi({
  reducerPath: 'brandsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE_URL}/api/v1`,
    credentials: 'include',
  }),
  tagTypes: ['Brand'],
  endpoints: (builder) => ({
    // List brands
    getAllBrands: builder.query({
      query: (params) => ({
        url: '/brands',
        params,
      }),
      providesTags: ['Brand'],
    }),

    // Get one brand
    getBrandById: builder.query({
      query: (id) => `/brands/${id}`,
      providesTags: (result, error, id) => [{ type: 'Brand', id }],
    }),

    // Create brand with fallback routes and configurable path
    createBrand: builder.mutation({
      async queryFn(data, api, extraOptions, baseQuery) {
        const envPath = import.meta.env.VITE_BRANDS_CREATE_PATH;
        const envMethod = (import.meta.env.VITE_BRANDS_CREATE_METHOD || 'POST').toUpperCase();
        const tryRequests = [
          envPath ? { url: envPath, method: envMethod } : null,
          { url: '/brands', method: 'POST' },
          { url: '/brands', method: 'PUT' },
          { url: '/brands/new', method: 'POST' },
          { url: '/brands/add', method: 'POST' },
          { url: '/brand/create', method: 'POST' },
          { url: '/Brands/create', method: 'POST' },
        ].filter(Boolean);
        for (const req of tryRequests) {
          const result = await baseQuery({ url: req.url, method: req.method, body: data }, api, extraOptions);
          if (!result.error) return result;
          // if 404, try next path; otherwise return immediately
          if (result.error?.status !== 404) return result;
        }
        return { error: { status: 404, data: { message: 'No matching brand create endpoint found. Set VITE_BRANDS_CREATE_PATH to the correct route.' } } };
      },
      invalidatesTags: ['Brand'],
    }),

    // Update brand
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Brand', id }, 'Brand'],
    }),

    // Delete brand
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
