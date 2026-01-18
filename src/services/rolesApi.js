import { apiSlice } from "./apiSlice";

export const rolesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all roles
    getRoles: builder.query({
      query: (params) => ({
        url: "/roles",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 500000,
          search: params?.search || "",
          status: params?.status || "",
        },
      }),
      transformResponse: (response) => {
        console.log("API Response:", response);
        // تحويل البيانات لتتوافق مع النظام الجديد
        const roles = (response.data || []).map(role => ({
          ...role,
          id: role.id?.toString(),
          userCount: role.userCount || 0,
          color: role.color || "bg-gradient-to-r from-blue-500 to-indigo-500",
          createdAt: role.createdAt || new Date().toISOString(),
          modules: role.modules || {}
        }));
        
        return {
          roles,
          totalCount: response.totalCount || roles.length,
          totalPages: response.totalPages || 1,
          currentPage: response.currentPage || 1,
        };
      },
      providesTags: ["Role"],
    }),

    // Get single role
    getRole: builder.query({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),

    // Create role
    createRole: builder.mutation({
      query: (formData) => ({
        url: "/roles",
        method: "POST",
        body: {
          roleName: formData.roleName,
          description: formData.description,
          modules: formData.modules || {}
        },
      }),
      invalidatesTags: ["Role"],
    }),

    // Get modules and pages data
    getModulesAndPagesData: builder.query({
      query: () => "/roles/modules-data",
      transformResponse: (response) => {
        console.log("Modules Data Response:", response);
        return response.data || [];
      },
    }),

    // Update role modules
    updateRoleModules: builder.mutation({
      query: ({ roleId, modules }) => ({
        url: `/roles/${roleId}/modules`,
        method: "PUT",
        body: { modules },
      }),
      invalidatesTags: ["Role"],
    }),

    // Get role modules
    getRoleModules: builder.query({
      query: (roleId) => `/roles/${roleId}/modules`,
      transformResponse: (response) => {
        console.log("Role Modules Response:", response);
        return response.data?.modules || {};
      },
    }),

    // Update role
    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Role", id }, "Role"],
    }),

    // Delete role
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),

    // Toggle role status
    toggleRoleStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/roles/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Role", id }, "Role"],
    }),

    // Get role permissions
    getRolePermissions: builder.query({
      query: (roleId) => `/roles/${roleId}/permissions`,
      providesTags: (result, error, roleId) => [{ type: "RolePermissions", roleId }],
    }),

    // Update role permissions
    updateRolePermissions: builder.mutation({
      query: ({ roleId, pageId, permissions }) => ({
        url: `/rolepages/permissions`,
        method: "POST",
        body: { roleId, pageId, permissions },
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: "RolePermissions", roleId }],
    }),

    // Get role pages
    getRolePages: builder.query({
      query: (roleId) => `/rolepages/role/${roleId}`,
      providesTags: (result, error, roleId) => [{ type: "RolePages", roleId }],
    }),

    // Get all pages with role status
    getAllPagesWithRoleStatus: builder.query({
      query: (roleId) => `/rolepages/role/${roleId}/status`,
      providesTags: (result, error, roleId) => [{ type: "RolePages", roleId }],
    }),

    // Assign page to role
    assignPageToRole: builder.mutation({
      query: ({ roleId, pageId }) => ({
        url: `/rolepages/assign`,
        method: "POST",
        body: { roleId, pageId },
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: "RolePages", roleId }],
    }),

    // Remove page from role
    removePageFromRole: builder.mutation({
      query: ({ roleId, pageId }) => ({
        url: `/rolepages/remove/${roleId}/${pageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: "RolePages", roleId }],
    }),

    // Get role users
    getRoleUsers: builder.query({
      query: (roleId) => `/roles/${roleId}/users`,
      providesTags: (result, error, roleId) => [{ type: "RoleUsers", roleId }],
    }),

    // Get all roles with user counts
    getRolesWithUserCounts: builder.query({
      query: () => "/roles/users/counts",
      transformResponse: (response) => {
        console.log("Roles with user counts response:", response);
        return response.data || [];
      },
      providesTags: ["Role"],
    }),

    // Assign users to role
    assignUsersToRole: builder.mutation({
      query: ({ roleId, userIds }) => ({
        url: `/roles/${roleId}/users`,
        method: "POST",
        body: { userIds },
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: "RoleUsers", roleId }, "Role", "User"],
    }),

    // Remove users from role
    removeUsersFromRole: builder.mutation({
      query: ({ roleId, userIds }) => ({
        url: `/roles/${roleId}/users`,
        method: "DELETE",
        body: { userIds },
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: "RoleUsers", roleId }, "Role", "User"],
    }),

    // Get role audit log
    getRoleAuditLog: builder.query({
      query: (roleId) => `/roles/${roleId}/audit-log`,
      providesTags: (result, error, roleId) => [{ type: "RoleAuditLog", roleId }],
    }),

    // Bulk operations
    bulkUpdateRoles: builder.mutation({
      query: ({ roleIds, updates }) => ({
        url: "/roles/bulk-update",
        method: "PATCH",
        body: { roleIds, updates },
      }),
      invalidatesTags: ["Role"],
    }),

    bulkDeleteRoles: builder.mutation({
      query: ({ roleIds }) => ({
        url: "/roles/bulk-delete",
        method: "DELETE",
        body: { roleIds },
      }),
      invalidatesTags: ["Role"],
    }),

    // Export roles
    exportRoles: builder.mutation({
      query: (params) => ({
        url: "/roles/export",
        method: "POST",
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Import roles
    importRoles: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/roles/import",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Role"],
    }),

    // Get system modules
    getSystemModules: builder.query({
      query: () => "/permissions/system-modules",
      providesTags: ["SystemModules"],
    }),

    // Get permission types
    getPermissionTypes: builder.query({
      query: () => "/permissions/types",
      providesTags: ["PermissionTypes"],
    }),

    // Get role statistics
    getRoleStatistics: builder.query({
      query: () => "/system/roles/statistics",
      providesTags: ["RoleStatistics"],
    }),

    // Get all roles with user counts
    getRolesWithUserCounts: builder.query({
      query: () => "/roles/users/counts",
      transformResponse: (response) => {
        console.log("Roles with user counts response:", response);
        return response.data || [];
      },
      providesTags: ["Role"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useToggleRoleStatusMutation,
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  useGetRoleUsersQuery,
  useAssignUsersToRoleMutation,
  useRemoveUsersFromRoleMutation,
  useGetRoleAuditLogQuery,
  useBulkUpdateRolesMutation,
  useBulkDeleteRolesMutation,
  useExportRolesMutation,
  useImportRolesMutation,
  useGetSystemModulesQuery,
  useGetPermissionTypesQuery,
  useGetRoleStatisticsQuery,
  // New exports for page management
  useGetRolePagesQuery,
  useGetAllPagesWithRoleStatusQuery,
  useAssignPageToRoleMutation,
  useRemovePageFromRoleMutation,
      // New exports for modules system
    useGetModulesAndPagesDataQuery,
    useUpdateRoleModulesMutation,
    useGetRoleModulesQuery,
    // New exports for user management
    useGetRolesWithUserCountsQuery,
} = rolesApi;
