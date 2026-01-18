import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const accountingApi = createApi({
  reducerPath: 'accountingApi',
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
  tagTypes: ['Accounts', 'JournalEntries', 'TrialBalance', 'AccountStatement', 'AccountBalance'],
  endpoints: (builder) => ({
    // Accounts
    getAllAccounts: builder.query({
      query: (params) => ({
        url: "/accounting/accounts",
        params,
      }),
      providesTags: ["Accounts"],
    }),
    getAccountById: builder.query({
      query: (id) => `/accounting/accounts/${id}`,
      providesTags: (result, error, id) => [{ type: "Accounts", id }],
    }),
    createAccount: builder.mutation({
      query: (data) => ({
        url: "/accounting/accounts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Accounts"],
    }),
    updateAccount: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/accounting/accounts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Accounts", id }, "Accounts"],
    }),
    deleteAccount: builder.mutation({
      query: (id) => ({
        url: `/accounting/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Accounts"],
    }),
    getAccountBalance: builder.query({
      query: ({ id, ...params }) => ({
        url: `/accounting/accounts/${id}/balance`,
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: "AccountBalance", id }],
    }),

    // Journal Entries
    getAllJournalEntries: builder.query({
      query: (params) => ({
        url: "/accounting/journal-entries",
        params,
      }),
      providesTags: ["JournalEntries"],
    }),
    getJournalEntryById: builder.query({
      query: (id) => `/accounting/journal-entries/${id}`,
      providesTags: (result, error, id) => [{ type: "JournalEntries", id }],
    }),
    createJournalEntry: builder.mutation({
      query: (data) => ({
        url: "/accounting/journal-entries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["JournalEntries", "TrialBalance", "AccountStatement"],
    }),
    updateJournalEntry: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/accounting/journal-entries/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "JournalEntries", id },
        "JournalEntries",
        "TrialBalance",
        "AccountStatement",
      ],
    }),
    postJournalEntry: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/accounting/journal-entries/${id}/post`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        "JournalEntries",
        "Accounts",
        "TrialBalance",
        "AccountStatement",
      ],
    }),
    cancelJournalEntry: builder.mutation({
      query: (id) => ({
        url: `/accounting/journal-entries/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "JournalEntries", id }, "JournalEntries"],
    }),
    deleteJournalEntry: builder.mutation({
      query: (id) => ({
        url: `/accounting/journal-entries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JournalEntries"],
    }),

    // Trial Balance
    getTrialBalance: builder.query({
      query: (params) => ({
        url: "/accounting/trial-balance",
        params,
      }),
      providesTags: ["TrialBalance"],
    }),

    // Account Statement
    getAccountStatement: builder.query({
      query: ({ accountId, ...params }) => ({
        url: `/accounting/account-statement`,
        params: { accountId, ...params },
      }),
      providesTags: (result, error, { accountId }) => [
        { type: "AccountStatement", id: accountId },
      ],
    }),
  }),
});

export const {
  useGetAllAccountsQuery,
  useGetAccountByIdQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetAccountBalanceQuery,
  useGetAllJournalEntriesQuery,
  useGetJournalEntryByIdQuery,
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  usePostJournalEntryMutation,
  useCancelJournalEntryMutation,
  useDeleteJournalEntryMutation,
  useGetTrialBalanceQuery,
  useGetAccountStatementQuery,
} = accountingApi;
