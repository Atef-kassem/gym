import { apiSlice } from './apiSlice';

export const posApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POS Devices API
    getPosDevices: builder.query({
      query: (params) => ({
        url: '/pos-devices',
        params
      }),
      providesTags: ['POSDevices']
    }),

    createPosDevice: builder.mutation({
      query: (data) => ({
        url: '/pos-devices',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['POSDevices']
    }),

    updatePosDevice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-devices/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSDevices']
    }),

    deletePosDevice: builder.mutation({
      query: (id) => ({
        url: `/pos-devices/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['POSDevices']
    }),

    toggleDeviceStatus: builder.mutation({
      query: (id) => ({
        url: `/pos-devices/${id}/toggle`,
        method: 'PATCH'
      }),
      invalidatesTags: ['POSDevices']
    }),

    syncDevices: builder.mutation({
      query: () => ({
        url: '/pos-devices/sync',
        method: 'POST'
      }),
      invalidatesTags: ['POSDevices']
    }),

    getDeviceStats: builder.query({
      query: () => ({
        url: '/pos-devices/stats'
      }),
      providesTags: ['POSDeviceStats']
    }),

    // POS Settings API
    getPosSettings: builder.query({
      query: (params) => ({
        url: '/pos-settings',
        params
      }),
      providesTags: ['POSSettings']
    }),

    savePosSettings: builder.mutation({
      query: ({ category, ...data }) => ({
        url: `/pos-settings/${category}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['POSSettings']
    }),

    updatePosSetting: builder.mutation({
      query: ({ category, key, ...data }) => ({
        url: `/pos-settings/${category}/${key}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSSettings']
    }),

    deletePosSetting: builder.mutation({
      query: ({ category, key }) => ({
        url: `/pos-settings/${category}/${key}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['POSSettings']
    }),

    copySettingsToBranch: builder.mutation({
      query: (data) => ({
        url: '/pos-settings/copy-to-branch',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['POSSettings']
    }),

    resetSettingsToDefault: builder.mutation({
      query: ({ category, branchId }) => ({
        url: `/pos-settings/${category}/reset/${branchId || 'company'}`,
        method: 'POST'
      }),
      invalidatesTags: ['POSSettings']
    }),

    // POS Payment Methods API
    getPaymentMethods: builder.query({
      query: (params) => ({
        url: '/pos-payments',
        params
      }),
      providesTags: ['POSPaymentMethods']
    }),

    createPaymentMethod: builder.mutation({
      query: (data) => ({
        url: '/pos-payments',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['POSPaymentMethods']
    }),

    updatePaymentMethod: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-payments/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSPaymentMethods']
    }),

    deletePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/pos-payments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['POSPaymentMethods']
    }),

    togglePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/pos-payments/${id}/toggle`,
        method: 'PATCH'
      }),
      invalidatesTags: ['POSPaymentMethods']
    }),

    testPaymentConnection: builder.mutation({
      query: (id) => ({
        url: `/pos-payments/${id}/test`,
        method: 'POST'
      })
    }),

    updatePaymentMethodsOrder: builder.mutation({
      query: (data) => ({
        url: '/pos-payments/update-order',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSPaymentMethods']
    }),

    getPaymentMethodsStats: builder.query({
      query: () => ({
        url: '/pos-payments/stats'
      }),
      providesTags: ['POSPaymentStats']
    }),

    // POS Invoice Templates API
    getInvoiceTemplates: builder.query({
      query: (params) => ({
        url: '/pos-invoices',
        params
      }),
      providesTags: ['POSInvoiceTemplates']
    }),

    createInvoiceTemplate: builder.mutation({
      query: (data) => ({
        url: '/pos-invoices',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['POSInvoiceTemplates']
    }),

    updateInvoiceTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-invoices/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSInvoiceTemplates']
    }),

    deleteInvoiceTemplate: builder.mutation({
      query: (id) => ({
        url: `/pos-invoices/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['POSInvoiceTemplates']
    }),

    setDefaultTemplate: builder.mutation({
      query: (id) => ({
        url: `/pos-invoices/${id}/set-default`,
        method: 'PATCH'
      }),
      invalidatesTags: ['POSInvoiceTemplates']
    }),

    duplicateTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-invoices/${id}/duplicate`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['POSInvoiceTemplates']
    }),

    previewTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-invoices/${id}/preview`,
        method: 'POST',
        body: data
      })
    }),

    updateInvoiceTemplatesOrder: builder.mutation({
      query: (data) => ({
        url: '/pos-invoices/update-order',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSInvoiceTemplates']
    }),

    getInvoiceTemplatesStats: builder.query({
      query: () => ({
        url: '/pos-invoices/stats'
      }),
      providesTags: ['POSInvoiceStats']
    }),

    // POS Notification Rules API
    getNotificationRules: builder.query({
      query: (params) => ({
        url: '/pos-notifications',
        params
      }),
      providesTags: ['POSNotificationRules']
    }),

    createNotificationRule: builder.mutation({
      query: (data) => ({
        url: '/pos-notifications',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['POSNotificationRules']
    }),

    updateNotificationRule: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-notifications/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSNotificationRules']
    }),

    deleteNotificationRule: builder.mutation({
      query: (id) => ({
        url: `/pos-notifications/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['POSNotificationRules']
    }),

    toggleNotificationRule: builder.mutation({
      query: (id) => ({
        url: `/pos-notifications/${id}/toggle`,
        method: 'PATCH'
      }),
      invalidatesTags: ['POSNotificationRules']
    }),

    testNotificationRule: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-notifications/${id}/test`,
        method: 'POST',
        body: data
      })
    }),

    sendImmediateNotification: builder.mutation({
      query: (data) => ({
        url: '/pos-notifications/send-immediate',
        method: 'POST',
        body: data
      })
    }),

    updateRulesOrder: builder.mutation({
      query: (data) => ({
        url: '/pos-notifications/update-order',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSNotificationRules']
    }),

    getNotificationRulesStats: builder.query({
      query: () => ({
        url: '/pos-notifications/stats'
      }),
      providesTags: ['POSNotificationStats']
    }),

    // POS Report Templates API
    getReportTemplates: builder.query({
      query: (params) => ({
        url: '/pos-reports',
        params
      }),
      providesTags: ['POSReportTemplates']
    }),

    createReportTemplate: builder.mutation({
      query: (data) => ({
        url: '/pos-reports',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['POSReportTemplates']
    }),

    updateReportTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-reports/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSReportTemplates']
    }),

    deleteReportTemplate: builder.mutation({
      query: (id) => ({
        url: `/pos-reports/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['POSReportTemplates']
    }),

    toggleReportTemplate: builder.mutation({
      query: (id) => ({
        url: `/pos-reports/${id}/toggle`,
        method: 'PATCH'
      }),
      invalidatesTags: ['POSReportTemplates']
    }),

    generateSampleReport: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-reports/${id}/generate-sample`,
        method: 'POST',
        body: data
      })
    }),

    scheduleReport: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-reports/${id}/schedule`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['POSReportTemplates']
    }),

    unscheduleReport: builder.mutation({
      query: (id) => ({
        url: `/pos-reports/${id}/unschedule`,
        method: 'PATCH'
      }),
      invalidatesTags: ['POSReportTemplates']
    }),

    updateReportTemplatesOrder: builder.mutation({
      query: (data) => ({
        url: '/pos-reports/update-order',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['POSReportTemplates']
    }),

    getReportTemplatesStats: builder.query({
      query: () => ({
        url: '/pos-reports/stats'
      }),
      providesTags: ['POSReportStats']
    }),

    // POS Dashboard API
    // getPosDashboard: builder.query({
    //   query: () => ({
    //     url: '/pos-dashboard'
    //   }),
    //   providesTags: ['POSDashboard']
    // }),

    // POS System Status API
    // getPosSystemStatus: builder.query({
    //   query: () => ({
    //     url: '/pos-system-status'
    //   }),
    //   providesTags: ['POSSystemStatus']
    // })
  })
});

export const {
  // POS Devices
  useGetPosDevicesQuery,
  useCreatePosDeviceMutation,
  useUpdatePosDeviceMutation,
  useDeletePosDeviceMutation,
  useToggleDeviceStatusMutation,
  useSyncDevicesMutation,
  useGetDeviceStatsQuery,

  // POS Settings
  useGetPosSettingsQuery,
  useSavePosSettingsMutation,
  useUpdatePosSettingMutation,
  useDeletePosSettingMutation,
  useCopySettingsToBranchMutation,
  useResetSettingsToDefaultMutation,

  // POS Payment Methods
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useTogglePaymentMethodMutation,
  useTestPaymentConnectionMutation,
  useUpdatePaymentMethodsOrderMutation,
  useGetPaymentMethodsStatsQuery,

  // POS Invoice Templates
  useGetInvoiceTemplatesQuery,
  useCreateInvoiceTemplateMutation,
  useUpdateInvoiceTemplateMutation,
  useDeleteInvoiceTemplateMutation,
  useSetDefaultTemplateMutation,
  useDuplicateTemplateMutation,
  usePreviewTemplateMutation,
  useUpdateInvoiceTemplatesOrderMutation,
  useGetInvoiceTemplatesStatsQuery,

  // POS Notification Rules
  useGetNotificationRulesQuery,
  useCreateNotificationRuleMutation,
  useUpdateNotificationRuleMutation,
  useDeleteNotificationRuleMutation,
  useToggleNotificationRuleMutation,
  useTestNotificationRuleMutation,
  useSendImmediateNotificationMutation,
  useUpdateRulesOrderMutation,
  useGetNotificationRulesStatsQuery,

  // POS Report Templates
  useGetReportTemplatesQuery,
  useCreateReportTemplateMutation,
  useUpdateReportTemplateMutation,
  useDeleteReportTemplateMutation,
  useToggleReportTemplateMutation,
  useGenerateSampleReportMutation,
  useScheduleReportMutation,
  useUnscheduleReportMutation,
  useUpdateReportTemplatesOrderMutation,
  useGetReportTemplatesStatsQuery,

  // POS Dashboard & System Status
  // useGetPosDashboardQuery,
  // useGetPosSystemStatusQuery
} = posApi;
