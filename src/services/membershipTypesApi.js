import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const membershipTypesApi = createApi({
  reducerPath: 'membershipTypesApi',
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
  tagTypes: ['MembershipType'],
  endpoints: (builder) => ({
    getAllMembershipTypes: builder.query({
      query: () => "/gym/membership-types",
      providesTags: ["MembershipType"],
    }),
    getMembershipTypeById: builder.query({
      query: (id) => `/gym/membership-types/${id}`,
      providesTags: (result, error, id) => [{ type: "MembershipType", id }],
    }),
    createMembershipType: builder.mutation({
      query: (data) => ({
        url: "/gym/membership-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MembershipType"],
    }),
    updateMembershipType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/membership-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["MembershipType"],
    }),
    deleteMembershipType: builder.mutation({
      query: (id) => ({
        url: `/gym/membership-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MembershipType"],
    }),
  }),
});

export const {
  useGetAllMembershipTypesQuery,
  useGetMembershipTypeByIdQuery,
  useCreateMembershipTypeMutation,
  useUpdateMembershipTypeMutation,
  useDeleteMembershipTypeMutation,
} = membershipTypesApi;

