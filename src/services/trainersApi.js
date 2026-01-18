import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const trainersApi = createApi({
  reducerPath: 'trainersApi',
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
  tagTypes: ['Trainer', 'TrainerSalary'],
  endpoints: (builder) => ({
    getAllTrainers: builder.query({
      query: (params = {}) => ({
        url: "/app/trainers",
        params,
      }),
      providesTags: ["Trainer"],
    }),
    getTrainerById: builder.query({
      query: (id) => `/app/trainers/${id}`,
      providesTags: (result, error, id) => [{ type: "Trainer", id }],
    }),
    createTrainer: builder.mutation({
      query: (trainerData) => ({
        url: "/app/trainers",
        method: "POST",
        body: trainerData,
      }),
      invalidatesTags: ["Trainer"],
    }),
    updateTrainer: builder.mutation({
      query: ({ id, ...trainerData }) => ({
        url: `/app/trainers/${id}`,
        method: "PUT",
        body: trainerData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Trainer", id },
        "Trainer",
      ],
    }),
    deleteTrainer: builder.mutation({
      query: (id) => ({
        url: `/app/trainers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Trainer"],
    }),
    // Trainer Salary Endpoints
    getAllTrainerSalaries: builder.query({
      query: (params = {}) => ({
        url: "/gym/trainer-salaries",
        params,
      }),
      providesTags: ["TrainerSalary"],
    }),
    getTrainerSalaryById: builder.query({
      query: (id) => `/gym/trainer-salaries/${id}`,
      providesTags: (result, error, id) => [{ type: "TrainerSalary", id }],
    }),
    getActiveTrainerSalary: builder.query({
      query: (trainerId) => `/gym/trainer-salaries/trainer/${trainerId}/active`,
      providesTags: (result, error, trainerId) => [{ type: "TrainerSalary", id: `active-${trainerId}` }],
    }),
    createTrainerSalary: builder.mutation({
      query: (salaryData) => ({
        url: "/gym/trainer-salaries",
        method: "POST",
        body: salaryData,
      }),
      invalidatesTags: ["TrainerSalary"],
    }),
    updateTrainerSalary: builder.mutation({
      query: ({ id, ...salaryData }) => ({
        url: `/gym/trainer-salaries/${id}`,
        method: "PATCH",
        body: salaryData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TrainerSalary", id },
        "TrainerSalary",
      ],
    }),
    deleteTrainerSalary: builder.mutation({
      query: (id) => ({
        url: `/gym/trainer-salaries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TrainerSalary"],
    }),
    // Trainer Details with Statistics
    getTrainerDetails: builder.query({
      query: ({ trainerId, startDate, endDate, month, year }) => ({
        url: `/gym/trainers/${trainerId}/details`,
        params: {
          startDate,
          endDate,
          month,
          year,
        },
      }),
      providesTags: (result, error, { trainerId }) => [{ type: "Trainer", id: trainerId }],
    }),
  }),
});

export const {
  useGetAllTrainersQuery,
  useGetTrainerByIdQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
  useGetAllTrainerSalariesQuery,
  useGetTrainerSalaryByIdQuery,
  useGetActiveTrainerSalaryQuery,
  useCreateTrainerSalaryMutation,
  useUpdateTrainerSalaryMutation,
  useDeleteTrainerSalaryMutation,
  useGetTrainerDetailsQuery,
} = trainersApi;

