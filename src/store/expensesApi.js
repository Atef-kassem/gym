import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://metagym.metacodecx.com/api/v1/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Expense'],
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: (params) => ({
        url: 'expenses',
        params,
      }),
      providesTags: ['Expense'],
    }),

    getExpense: builder.query({
      query: (id) => `expenses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Expense', id }],
    }),

    createExpense: builder.mutation({
      query: (expense) => ({
        url: 'expenses',
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Expense'],
    }),

    updateExpense: builder.mutation({
      query: ({ id, data }) => ({
        url: `expenses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Expense', id },
        'Expense',
      ],
    }),

    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expense'],
    }),

    approveExpense: builder.mutation({
      query: (id) => ({
        url: `expenses/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Expense', id },
        'Expense',
      ],
    }),

    rejectExpense: builder.mutation({
      query: (id) => ({
        url: `expenses/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Expense', id },
        'Expense',
      ],
    }),

    getExpenseStatistics: builder.query({
      query: (params) => ({
        url: 'expenses/statistics',
        params,
      }),
      providesTags: ['Expense'],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useApproveExpenseMutation,
  useRejectExpenseMutation,
  useGetExpenseStatisticsQuery,
} = expensesApi;

