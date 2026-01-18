import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://metagym.metacodecx.com';

export const loyaltyApi = createApi({
  reducerPath: 'loyaltyApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${BASE_URL}/api/v1`,
    prepareHeaders: (headers) => {
      // يمكن إضافة headers للمصادقة هنا إذا لزم الأمر
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['LoyaltyMember', 'PointsTransaction', 'LoyaltyRule', 'LoyaltyReward'],
  endpoints: (builder) => ({
    // أعضاء الولاء
    getLoyaltyMembers: builder.query({
      query: (params) => ({
        url: '/loyalty/members',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10000000,
          search: params?.search || '',
          level: params?.level || 'all',
          status: params?.status || 'all',
          sortBy: params?.sortBy || 'createdAt',
          sortOrder: params?.sortOrder || 'DESC'
        }
      }),
      providesTags: ['LoyaltyMember']
    }),

    getLoyaltyMember: builder.query({
      query: (id) => `/loyalty/members/${id}`,
      providesTags: (result, error, id) => [{ type: 'LoyaltyMember', id }]
    }),

    createLoyaltyMember: builder.mutation({
      query: (memberData) => ({
        url: '/loyalty/members',
        method: 'POST',
        body: memberData
      }),
      invalidatesTags: ['LoyaltyMember']
    }),

    updateLoyaltyMember: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/loyalty/members/${id}`,
        method: 'PATCH',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LoyaltyMember', id }]
    }),

    deleteLoyaltyMember: builder.mutation({
      query: (id) => ({
        url: `/loyalty/members/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['LoyaltyMember']
    }),

    toggleMemberStatus: builder.mutation({
      query: (id) => ({
        url: `/loyalty/members/${id}/status`,
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'LoyaltyMember', id }]
    }),

    updateMemberPoints: builder.mutation({
      query: ({ id, ...pointsData }) => ({
        url: `/loyalty/members/${id}/points`,
        method: 'PATCH',
        body: pointsData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LoyaltyMember', id }]
    }),

    getMemberStats: builder.query({
      query: () => '/loyalty/members/stats',
      providesTags: ['LoyaltyMember']
    }),

    exportMembers: builder.query({
      query: () => '/loyalty/members/export',
      providesTags: ['LoyaltyMember']
    }),

    // معاملات النقاط
    getPointsTransactions: builder.query({
      query: (params) => ({
        url: '/loyalty/transactions',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10000000,
          customerId: params?.customerId || '',
          type: params?.type || '',
          sortBy: params?.sortBy || 'date',
          sortOrder: params?.sortOrder || 'DESC'
        }
      }),
      providesTags: ['PointsTransaction']
    }),

    getTransaction: builder.query({
      query: (id) => `/loyalty/transactions/${id}`,
      providesTags: (result, error, id) => [{ type: 'PointsTransaction', id }]
    }),

    createTransaction: builder.mutation({
      query: (transactionData) => ({
        url: '/loyalty/transactions',
        method: 'POST',
        body: transactionData
      }),
      invalidatesTags: ['PointsTransaction', 'LoyaltyMember']
    }),

    updateTransaction: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/loyalty/transactions/${id}`,
        method: 'PATCH',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PointsTransaction', id }]
    }),

    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/loyalty/transactions/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['PointsTransaction']
    }),

    getTransactionStats: builder.query({
      query: () => '/loyalty/transactions/stats',
      providesTags: ['PointsTransaction']
    }),

    exportTransactions: builder.query({
      query: () => '/loyalty/transactions/export',
      providesTags: ['PointsTransaction']
    }),

    // قواعد الولاء
    getLoyaltyRules: builder.query({
      query: () => '/loyalty/rules',
      providesTags: ['LoyaltyRule']
    }),

    getActiveRules: builder.query({
      query: () => '/loyalty/rules/active',
      providesTags: ['LoyaltyRule']
    }),

    getRule: builder.query({
      query: (id) => `/loyalty/rules/${id}`,
      providesTags: (result, error, id) => [{ type: 'LoyaltyRule', id }]
    }),

    createRule: builder.mutation({
      query: (ruleData) => ({
        url: '/loyalty/rules',
        method: 'POST',
        body: ruleData
      }),
      invalidatesTags: ['LoyaltyRule']
    }),

    updateRule: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/loyalty/rules/${id}`,
        method: 'PATCH',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LoyaltyRule', id }]
    }),

    deleteRule: builder.mutation({
      query: (id) => ({
        url: `/loyalty/rules/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['LoyaltyRule']
    }),

    toggleRuleStatus: builder.mutation({
      query: (id) => ({
        url: `/loyalty/rules/${id}/status`,
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'LoyaltyRule', id }]
    }),

    duplicateRule: builder.mutation({
      query: (id) => ({
        url: `/loyalty/rules/${id}/duplicate`,
        method: 'POST'
      }),
      invalidatesTags: ['LoyaltyRule']
    }),

    getRuleStats: builder.query({
      query: () => '/loyalty/rules/stats',
      providesTags: ['LoyaltyRule']
    }),

    // مكافآت الولاء
    getLoyaltyRewards: builder.query({
      query: () => '/loyalty/rewards',
      providesTags: ['LoyaltyReward']
    }),

    getAvailableRewards: builder.query({
      query: () => '/loyalty/rewards/available',
      providesTags: ['LoyaltyReward']
    }),

    getReward: builder.query({
      query: (id) => `/loyalty/rewards/${id}`,
      providesTags: (result, error, id) => [{ type: 'LoyaltyReward', id }]
    }),

    createReward: builder.mutation({
      query: (rewardData) => ({
        url: '/loyalty/rewards',
        method: 'POST',
        body: rewardData
      }),
      invalidatesTags: ['LoyaltyReward']
    }),

    updateReward: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/loyalty/rewards/${id}`,
        method: 'PATCH',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LoyaltyReward', id }]
    }),

    deleteReward: builder.mutation({
      query: (id) => ({
        url: `/loyalty/rewards/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['LoyaltyReward']
    }),

    toggleRewardStatus: builder.mutation({
      query: (id) => ({
        url: `/loyalty/rewards/${id}/status`,
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'LoyaltyReward', id }]
    }),

    duplicateReward: builder.mutation({
      query: (id) => ({
        url: `/loyalty/rewards/${id}/duplicate`,
        method: 'POST'
      }),
      invalidatesTags: ['LoyaltyReward']
    }),

    redeemReward: builder.mutation({
      query: ({ id, ...redeemData }) => ({
        url: `/loyalty/rewards/${id}/redeem`,
        method: 'POST',
        body: redeemData
      }),
      invalidatesTags: ['LoyaltyReward', 'LoyaltyMember', 'PointsTransaction']
    }),

    getRewardStats: builder.query({
      query: () => '/loyalty/rewards/stats',
      providesTags: ['LoyaltyReward']
    }),
  }),
});

export const {
  // أعضاء الولاء
  useGetLoyaltyMembersQuery,
  useGetLoyaltyMemberQuery,
  useCreateLoyaltyMemberMutation,
  useUpdateLoyaltyMemberMutation,
  useDeleteLoyaltyMemberMutation,
  useToggleMemberStatusMutation,
  useUpdateMemberPointsMutation,
  useGetMemberStatsQuery,
  useExportMembersQuery,

  // معاملات النقاط
  useGetPointsTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionStatsQuery,
  useExportTransactionsQuery,

  // قواعد الولاء
  useGetLoyaltyRulesQuery,
  useGetActiveRulesQuery,
  useGetRuleQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
  useToggleRuleStatusMutation,
  useDuplicateRuleMutation,
  useGetRuleStatsQuery,

  // مكافآت الولاء
  useGetLoyaltyRewardsQuery,
  useGetAvailableRewardsQuery,
  useGetRewardQuery,
  useCreateRewardMutation,
  useUpdateRewardMutation,
  useDeleteRewardMutation,
  useToggleRewardStatusMutation,
  useDuplicateRewardMutation,
  useRedeemRewardMutation,
  useGetRewardStatsQuery,
} = loyaltyApi;
