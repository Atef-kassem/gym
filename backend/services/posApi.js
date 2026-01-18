import { apiSlice } from './apiSlice';

export const posApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POS Devices API
    getPosDevices: builder.query({
      query: (params) => ({
        url: '/api/v1/pos-devices',
        params,
      }),
      providesTags: ['POSDevices'],
    }),

    getPosDevice: builder.query({
      query: (id) => `/api/v1/pos-devices/${id}`,
      providesTags: (result, error, id) => [{ type: 'POSDevices', id }],
    }),

    createPosDevice: builder.mutation({
      query: (data) => ({
        url: '/api/v1/pos-devices',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['POSDevices'],
    }),

    updatePosDevice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/pos-devices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['POSDevices'],
    }),

    deletePosDevice: builder.mutation({
      query: (id) => ({
        url: `/api/v1/pos-devices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['POSDevices'],
    }),

    toggleDeviceStatus: builder.mutation({
      query: (id) => ({
        url: `/api/v1/pos-devices/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['POSDevices'],
    }),

    syncDevices: builder.mutation({
      query: () => ({
        url: '/api/v1/pos-devices/sync',
        method: 'POST',
      }),
      invalidatesTags: ['POSDevices'],
    }),

    getDeviceStats: builder.query({
      query: () => '/api/v1/pos-devices/stats',
      providesTags: ['POSDeviceStats'],
    }),

    // POS Settings API
    getPosSettings: builder.query({
      query: (params) => ({
        url: '/api/v1/pos-settings',
        params,
      }),
      providesTags: ['POSSettings'],
    }),

    getSetting: builder.query({
      query: ({ category, key }) => `/api/v1/pos-settings/${category}/${key}`,
      providesTags: (result, error, { category, key }) => [{ type: 'POSSettings', category, key }],
    }),

    saveSettings: builder.mutation({
      query: ({ category, ...data }) => ({
        url: `/api/v1/pos-settings/${category}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['POSSettings'],
    }),

    updateSetting: builder.mutation({
      query: ({ category, key, ...data }) => ({
        url: `/api/v1/pos-settings/${category}/${key}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['POSSettings'],
    }),

    deleteSetting: builder.mutation({
      query: ({ category, key }) => ({
        url: `/api/v1/pos-settings/${category}/${key}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['POSSettings'],
    }),

    copySettingsToBranch: builder.mutation({
      query: (data) => ({
        url: '/api/v1/pos-settings/copy-to-branch',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['POSSettings'],
    }),

    resetSettings: builder.mutation({
      query: ({ category, branchId }) => ({
        url: `/api/v1/pos-settings/${category}/${branchId}/reset`,
        method: 'POST',
      }),
      invalidatesTags: ['POSSettings'],
    }),

    // POS Payment Methods API
    getPaymentMethods: builder.query({
      query: (params) => ({
        url: '/pos-payments',
        params,
      }),
      providesTags: ['POSPaymentMethods'],
    }),

    getPaymentMethod: builder.query({
      query: (id) => `/pos-payments/${id}`,
      providesTags: (result, error, id) => [{ type: 'POSPaymentMethods', id }],
    }),

    createPaymentMethod: builder.mutation({
      query: (data) => ({
        url: '/pos-payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['POSPaymentMethods'],
    }),

    updatePaymentMethod: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-payments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'POSPaymentMethods', id }],
    }),

    deletePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/pos-payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['POSPaymentMethods'],
    }),

    togglePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/pos-payments/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'POSPaymentMethods', id }],
    }),

    testPaymentConnection: builder.mutation({
      query: (id) => ({
        url: `/pos-payments/${id}/test-connection`,
        method: 'POST',
      }),
    }),

    updatePaymentMethodsOrder: builder.mutation({
      query: (data) => ({
        url: '/pos-payments/update-order',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['POSPaymentMethods'],
    }),

    getPaymentMethodsStats: builder.query({
      query: () => '/pos-payments/stats',
      providesTags: ['POSPaymentMethodsStats'],
    }),

    // POS Invoice Templates API
    getInvoiceTemplates: builder.query({
      query: (params) => ({
        url: '/pos-invoices',
        params,
      }),
      providesTags: ['POSInvoiceTemplates'],
    }),

    getInvoiceTemplate: builder.query({
      query: (id) => `/pos-invoices/${id}`,
      providesTags: (result, error, id) => [{ type: 'POSInvoiceTemplates', id }],
    }),

    createInvoiceTemplate: builder.mutation({
      query: (data) => ({
        url: '/pos-invoices',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['POSInvoiceTemplates'],
    }),

    updateInvoiceTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-invoices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'POSInvoiceTemplates', id }],
    }),

    deleteInvoiceTemplate: builder.mutation({
      query: (id) => ({
        url: `/pos-invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['POSInvoiceTemplates'],
    }),

    setDefaultTemplate: builder.mutation({
      query: (id) => ({
        url: `/pos-invoices/${id}/set-default`,
        method: 'PATCH',
      }),
      invalidatesTags: ['POSInvoiceTemplates'],
    }),

    duplicateTemplate: builder.mutation({
      query: (id) => ({
        url: `/pos-invoices/${id}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: ['POSInvoiceTemplates'],
    }),

    previewTemplate: builder.mutation({
      query: ({ id, data }) => ({
        url: `/pos-invoices/${id}/preview`,
        method: 'POST',
        body: data,
      }),
    }),

    updateTemplatesOrder: builder.mutation({
      query: (data) => ({
        url: '/pos-invoices/update-order',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['POSInvoiceTemplates'],
    }),

    getTemplatesStats: builder.query({
      query: () => '/pos-invoices/stats',
      providesTags: ['POSInvoiceTemplatesStats'],
    }),

    // POS Notification Rules API
    getNotificationRules: builder.query({
      query: (params) => ({
        url: '/pos-notifications',
        params,
      }),
      providesTags: ['POSNotificationRules'],
    }),

    getNotificationRule: builder.query({
      query: (id) => `/pos-notifications/${id}`,
      providesTags: (result, error, id) => [{ type: 'POSNotificationRules', id }],
    }),

    createNotificationRule: builder.mutation({
      query: (data) => ({
        url: '/pos-notifications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['POSNotificationRules'],
    }),

    updateNotificationRule: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-notifications/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'POSNotificationRules', id }],
    }),

    deleteNotificationRule: builder.mutation({
      query: (id) => ({
        url: `/pos-notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['POSNotificationRules'],
    }),

    toggleNotificationRule: builder.mutation({
      query: (id) => ({
        url: `/pos-notifications/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'POSNotificationRules', id }],
    }),

    testNotificationRule: builder.mutation({
      query: (id) => ({
        url: `/pos-notifications/${id}/test`,
        method: 'POST',
      }),
    }),

    sendImmediateNotification: builder.mutation({
      query: (data) => ({
        url: '/pos-notifications/send-immediate',
        method: 'POST',
        body: data,
      }),
    }),

    updateRulesOrder: builder.mutation({
      query: (data) => ({
        url: '/pos-notifications/update-order',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['POSNotificationRules'],
    }),

    getNotificationRulesStats: builder.query({
      query: () => '/pos-notifications/stats',
      providesTags: ['POSNotificationRulesStats'],
    }),

    // POS Report Templates API
    getReportTemplates: builder.query({
      query: (params) => ({
        url: '/pos-reports',
        params,
      }),
      providesTags: ['POSReportTemplates'],
    }),

    getReportTemplate: builder.query({
      query: (id) => `/pos-reports/${id}`,
      providesTags: (result, error, id) => [{ type: 'POSReportTemplates', id }],
    }),

    createReportTemplate: builder.mutation({
      query: (data) => ({
        url: '/pos-reports',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['POSReportTemplates'],
    }),

    updateReportTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-reports/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'POSReportTemplates', id }],
    }),

    deleteReportTemplate: builder.mutation({
      query: (id) => ({
        url: `/pos-reports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['POSReportTemplates'],
    }),

    toggleReportTemplate: builder.mutation({
      query: (id) => ({
        url: `/pos-reports/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'POSReportTemplates', id }],
    }),

    generateSampleReport: builder.mutation({
      query: (id) => ({
        url: `/pos-reports/${id}/generate-sample`,
        method: 'POST',
      }),
    }),

    scheduleReport: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pos-reports/${id}/schedule`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'POSReportTemplates', id }],
    }),

    unscheduleReport: builder.mutation({
      query: (id) => ({
        url: `/pos-reports/${id}/unschedule`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'POSReportTemplates', id }],
    }),

    updateTemplatesOrder: builder.mutation({
      query: (data) => ({
        url: '/pos-reports/update-order',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['POSReportTemplates'],
    }),

    getTemplatesStats: builder.query({
      query: () => '/pos-reports/stats',
      providesTags: ['POSReportTemplatesStats'],
    }),

    // POS Dashboard API
    // getPosDashboard: builder.query({
    //   query: () => '/pos-dashboard',
    //   providesTags: ['POSDashboard'],
    // }),

    // POS System Status API
    // getPosSystemStatus: builder.query({
    //   query: () => '/pos-system-status',
    //   providesTags: ['POSSystemStatus'],
    // }),
  }),
});

export const {
  // POS Devices
  useGetPosDevicesQuery,
  useGetPosDeviceQuery,
  useCreatePosDeviceMutation,
  useUpdatePosDeviceMutation,
  useDeletePosDeviceMutation,
  useToggleDeviceStatusMutation,
  useSyncDevicesMutation,
  useGetDeviceStatsQuery,

  // POS Settings
  useGetPosSettingsQuery,
  useGetSettingQuery,
  useSaveSettingsMutation,
  useUpdateSettingMutation,
  useDeleteSettingMutation,
  useCopySettingsToBranchMutation,
  useResetSettingsMutation,

  // POS Payment Methods
  useGetPaymentMethodsQuery,
  useGetPaymentMethodQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useTogglePaymentMethodMutation,
  useTestPaymentConnectionMutation,
  useUpdatePaymentMethodsOrderMutation,
  useGetPaymentMethodsStatsQuery,

  // POS Invoice Templates
  useGetInvoiceTemplatesQuery,
  useGetInvoiceTemplateQuery,
  useCreateInvoiceTemplateMutation,
  useUpdateInvoiceTemplateMutation,
  useDeleteInvoiceTemplateMutation,
  useSetDefaultTemplateMutation,
  useDuplicateTemplateMutation,
  usePreviewTemplateMutation,
  useUpdateTemplatesOrderMutation,
  useGetTemplatesStatsQuery,

  // POS Notification Rules
  useGetNotificationRulesQuery,
  useGetNotificationRuleQuery,
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
  useGetReportTemplateQuery,
  useCreateReportTemplateMutation,
  useUpdateReportTemplateMutation,
  useDeleteReportTemplateMutation,
  useToggleReportTemplateMutation,
  useGenerateSampleReportMutation,
  useScheduleReportMutation,
  useUnscheduleReportMutation,
  useUpdateTemplatesOrderMutation,
  useGetTemplatesStatsQuery,

  // POS Dashboard & System Status
  // useGetPosDashboardQuery,
  // useGetPosSystemStatusQuery,
} = posApi;
