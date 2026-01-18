import { apiSlice } from "./apiSlice";

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get audit logs
    getAuditLogs: builder.query({
      query: (params) => ({
        url: "/audit/logs",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 50000000000,
          search: params?.search || "",
          type: params?.type || "",
          user: params?.user || "",
          startDate: params?.startDate || "",
          endDate: params?.endDate || "",
        },
      }),
      transformResponse: (response) => ({
        logs: response.data || [],
        totalCount: response.totalCount || 0,
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
      }),
      providesTags: ["AuditLog"],
    }),

    // Get audit log by ID
    getAuditLog: builder.query({
      query: (id) => `/audit/logs/${id}`,
      providesTags: (result, error, id) => [{ type: "AuditLog", id }],
    }),

    // Get user audit logs
    getUserAuditLogs: builder.query({
      query: (userId) => `/audit/users/${userId}/logs`,
      providesTags: (result, error, userId) => [{ type: "UserAuditLog", userId }],
    }),

    // Get role audit logs
    getRoleAuditLogs: builder.query({
      query: (roleId) => `/audit/roles/${roleId}/logs`,
      providesTags: (result, error, roleId) => [{ type: "RoleAuditLog", roleId }],
    }),

    // Get system audit logs
    getSystemAuditLogs: builder.query({
      query: (params) => ({
        url: "/audit/system",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 50000000000,
          module: params?.module || "",
          action: params?.action || "",
          startDate: params?.startDate || "",
          endDate: params?.endDate || "",
        },
      }),
      providesTags: ["SystemAuditLog"],
    }),

    // Get audit statistics
    getAuditStatistics: builder.query({
      query: (params) => ({
        url: "/audit/statistics",
        params: {
          period: params?.period || "7d", // 1d, 7d, 30d, 90d, 1y
          type: params?.type || "",
        },
      }),
      providesTags: ["AuditStatistics"],
    }),

    // Export audit logs
    exportAuditLogs: builder.mutation({
      query: (params) => ({
        url: "/audit/export",
        method: "POST",
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Clear audit logs
    clearAuditLogs: builder.mutation({
      query: (params) => ({
        url: "/audit/clear",
        method: "DELETE",
        body: params,
      }),
      invalidatesTags: ["AuditLog", "UserAuditLog", "RoleAuditLog", "SystemAuditLog"],
    }),

    // Get login history
    getLoginHistory: builder.query({
      query: (params) => ({
        url: "/audit/login-history",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 50000000000,
          user: params?.user || "",
          status: params?.status || "",
          startDate: params?.startDate || "",
          endDate: params?.endDate || "",
        },
      }),
      providesTags: ["LoginHistory"],
    }),

    // Get failed login attempts
    getFailedLoginAttempts: builder.query({
      query: (params) => ({
        url: "/audit/failed-logins",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 50000000000,
          user: params?.user || "",
          startDate: params?.startDate || "",
          endDate: params?.endDate || "",
        },
      }),
      providesTags: ["FailedLogins"],
    }),

    // Get security events
    getSecurityEvents: builder.query({
      query: (params) => ({
        url: "/audit/security-events",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 50000000000,
          severity: params?.severity || "",
          type: params?.type || "",
          startDate: params?.startDate || "",
          endDate: params?.endDate || "",
        },
      }),
      providesTags: ["SecurityEvents"],
    }),

    // Get data access logs
    getDataAccessLogs: builder.query({
      query: (params) => ({
        url: "/audit/data-access",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 50000000000,
          user: params?.user || "",
          resource: params?.resource || "",
          action: params?.action || "",
          startDate: params?.startDate || "",
          endDate: params?.endDate || "",
        },
      }),
      providesTags: ["DataAccessLogs"],
    }),

    // Get permission change logs
    getPermissionChangeLogs: builder.query({
      query: (params) => ({
        url: "/audit/permission-changes",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 50000000000,
          user: params?.user || "",
          role: params?.role || "",
          type: params?.type || "",
          startDate: params?.startDate || "",
          endDate: params?.endDate || "",
        },
      }),
      providesTags: ["PermissionChangeLogs"],
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
  useGetAuditLogQuery,
  useGetUserAuditLogsQuery,
  useGetRoleAuditLogsQuery,
  useGetSystemAuditLogsQuery,
  useGetAuditStatisticsQuery,
  useExportAuditLogsMutation,
  useClearAuditLogsMutation,
  useGetLoginHistoryQuery,
  useGetFailedLoginAttemptsQuery,
  useGetSecurityEventsQuery,
  useGetDataAccessLogsQuery,
  useGetPermissionChangeLogsQuery,
} = auditApi;
