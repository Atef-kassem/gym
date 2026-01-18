import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const groupsApi = createApi({
  reducerPath: 'groupsApi',
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
  tagTypes: ['Group', 'GroupCategory'],
  endpoints: (builder) => ({
    getAllGroups: builder.query({
      query: (params) => ({
        url: "/gym/groups",
        params,
      }),
      providesTags: ["Group"],
    }),
    getGroupById: builder.query({
      query: (id) => `/gym/groups/${id}`,
      providesTags: (result, error, id) => [{ type: "Group", id }],
    }),
    createGroup: builder.mutation({
      query: (data) => ({
        url: "/gym/groups",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
    updateGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/groups/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Group", id },
        "Group",
      ],
    }),
    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `/gym/groups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group"],
    }),
    getGroupStatistics: builder.query({
      query: () => "/gym/groups/statistics",
      providesTags: ["Group"],
    }),
    getAllCategories: builder.query({
      query: () => "/gym/groups/categories/all",
      providesTags: ["GroupCategory"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/gym/groups/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["GroupCategory"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/groups/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "GroupCategory", id },
        "GroupCategory",
      ],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/gym/groups/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GroupCategory"],
    }),
  }),
});

export const {
  useGetAllGroupsQuery,
  useGetGroupByIdQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupStatisticsQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = groupsApi;






