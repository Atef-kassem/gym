import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const classesApi = createApi({
  reducerPath: 'classesApi',
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
  tagTypes: ['Class', 'ClassEnrollment'],
  endpoints: (builder) => ({
    getAllClasses: builder.query({
      query: (params) => ({
        url: "/gym/classes",
        params,
      }),
      providesTags: ["Class"],
    }),
    getClassById: builder.query({
      query: (id) => `/gym/classes/${id}`,
      providesTags: (result, error, id) => [{ type: "Class", id }],
    }),
    createClass: builder.mutation({
      query: (data) => ({
        url: "/gym/classes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),
    updateClass: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/classes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Class", id },
        "Class",
      ],
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/gym/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
    enrollMember: builder.mutation({
      query: ({ classId, memberId }) => ({
        url: `/gym/classes/${classId}/enroll/${memberId}`,
        method: "POST",
      }),
      invalidatesTags: ["Class", "ClassEnrollment"],
    }),
    removeMember: builder.mutation({
      query: ({ classId, memberId }) => ({
        url: `/gym/classes/${classId}/remove/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class", "ClassEnrollment"],
    }),
    updateAttendance: builder.mutation({
      query: ({ classId, memberId, attendanceStatus, attendanceTime }) => ({
        url: `/gym/classes/${classId}/attendance/${memberId}`,
        method: "PUT",
        body: { attendanceStatus, attendanceTime },
      }),
      invalidatesTags: ["Class", "ClassEnrollment"],
    }),
    getClassStatistics: builder.query({
      query: (params) => ({
        url: "/gym/classes/statistics",
        params,
      }),
      providesTags: ["Class"],
    }),
  }),
});

export const {
  useGetAllClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useEnrollMemberMutation,
  useRemoveMemberMutation,
  useUpdateAttendanceMutation,
  useGetClassStatisticsQuery,
} = classesApi;

