import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const employeesApi = createApi({
  reducerPath: 'employeesApi',
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
  tagTypes: ['Employee', 'Department', 'Position', 'Attendance', 'Leave', 'Payroll'],
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: (params) => ({
        url: "/hr/employees",
        params,
      }),
      providesTags: ["Employee"],
    }),
    getTrainers: builder.query({
      query: () => "/hr/employees/trainers",
      providesTags: ["Employee"],
    }),
    getEmployeeById: builder.query({
      query: (id) => `/hr/employees/${id}`,
      providesTags: (result, error, id) => [{ type: "Employee", id }],
    }),
    createEmployee: builder.mutation({
      query: (formData) => ({
        url: "/hr/employees",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Employee"],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/hr/employees/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Employee", id },
        "Employee",
      ],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/hr/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employee"],
    }),
    getDepartments: builder.query({
      query: () => "/hr/employees/departments",
      providesTags: ["Department"],
    }),
    createDepartment: builder.mutation({
      query: (body) => ({
        url: "/hr/employees/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),
    getPositions: builder.query({
      query: () => "/hr/employees/positions",
      providesTags: ["Position"],
    }),

    // Attendance APIs
    getAllAttendance: builder.query({
      query: (params) => ({
        url: "/hr/attendance",
        params,
      }),
      providesTags: ["Attendance"],
    }),
    createAttendance: builder.mutation({
      query: (formData) => ({
        url: "/hr/attendance",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Attendance"],
    }),
    updateAttendance: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/hr/attendance/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Attendance"],
    }),
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/hr/attendance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
    }),

    // Leave APIs
    getAllLeaves: builder.query({
      query: (params) => ({
        url: "/hr/leaves",
        params,
      }),
      providesTags: ["Leave"],
    }),
    createLeave: builder.mutation({
      query: (formData) => ({
        url: "/hr/leaves",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Leave"],
    }),
    updateLeave: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/hr/leaves/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Leave"],
    }),
    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `/hr/leaves/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leave"],
    }),

    // Payroll APIs
    getAllPayrolls: builder.query({
      query: (params) => ({
        url: "/hr/payrolls",
        params,
      }),
      providesTags: ["Payroll"],
    }),
    createPayroll: builder.mutation({
      query: (formData) => ({
        url: "/hr/payrolls",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Payroll"],
    }),
    updatePayroll: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/hr/payrolls/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Payroll"],
    }),
    deletePayroll: builder.mutation({
      query: (id) => ({
        url: `/hr/payrolls/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payroll"],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetTrainersQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetDepartmentsQuery,
  useGetPositionsQuery,
  useCreateDepartmentMutation,
  useGetAllAttendanceQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useGetAllLeavesQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
  useGetAllPayrollsQuery,
  useCreatePayrollMutation,
  useUpdatePayrollMutation,
  useDeletePayrollMutation,
} = employeesApi;

