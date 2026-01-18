import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const branchesApi = createApi({
  reducerPath: 'branchesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE_URL}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Branch', 'Storage'],
  endpoints: (builder) => ({
    getAllBranches: builder.query({
      query: () => "/branches",
      providesTags: ["Branch"],
    }),
    createBranch: builder.mutation({
      query: (formData) => ({
        url: "/branches",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Branch"],
    }),
    getBranchById: builder.query({
      query: (id) => `/branches/${id}`,
      providesTags: (result, error, id) => [{ type: "Branch", id }],
    }),
    updateBranch: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/branches/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Branch", id },
        "Branch",
      ],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Branch"],
    }),
    createStorageForBranch: builder.mutation({
      query: ({ branchId, formData }) => ({
        url: `/branches/${branchId}/storages`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { branchId }) => [
        { type: "Storage", id: branchId },
      ],
    }),
    getBranchStorages: builder.query({
      query: (branchId) => `/branches/${branchId}/storages`,
      providesTags: (result, error, branchId) => [
        { type: "Storage", id: branchId },
      ],
    }),
  }),
});

export const {
  useGetAllBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useCreateStorageForBranchMutation,
  useGetBranchStoragesQuery,
} = branchesApi;
