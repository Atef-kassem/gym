import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const membersApi = createApi({
  reducerPath: 'membersApi',
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
  tagTypes: ['Member'],
  endpoints: (builder) => ({
    getAllMembers: builder.query({
      query: (params) => ({
        url: "/gym/members",
        params,
      }),
      providesTags: ["Member"],
    }),
    getMemberById: builder.query({
      query: (id) => `/gym/members/${id}`,
      providesTags: (result, error, id) => [{ type: "Member", id }],
    }),
    createMember: builder.mutation({
      query: (formData) => ({
        url: "/gym/members",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Member"],
    }),
    updateMember: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/gym/members/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Member", id },
        "Member",
      ],
    }),
    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/gym/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Member"],
    }),
    getMemberStatistics: builder.query({
      query: () => "/gym/members/statistics",
      providesTags: ["Member"],
    }),
  }),
});

export const {
  useGetAllMembersQuery,
  useGetMemberByIdQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetMemberStatisticsQuery,
} = membersApi;

