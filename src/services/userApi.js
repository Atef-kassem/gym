import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination and filters
    getUsers: builder.query({
      query: (params) => {
        console.log('=== USER API QUERY DEBUG ===');
        console.log('Query params:', params);
        console.log('Query URL:', "/users");
        console.log('Full query:', {
          url: "/users",
          params: {
            page: params?.page || 1,
            limit: params?.limit || 10000000,
            search: params?.search || "",
            role: params?.role || "",
            status: params?.status || "",
            department: params?.department || "",
          },
        });
        console.log('==========================');
        
        return {
          url: "/users",
          params: {
            page: params?.page || 1,
            limit: params?.limit || 10000000,
            search: params?.search || "",
            role: params?.role || "",
            status: params?.status || "",
            department: params?.department || "",
          },
        };
      },
      transformResponse: (response) => {
        console.log('=== USER API DEBUG ===');
        console.log('Raw response:', response);
        console.log('response.data:', response.data);
        console.log('response.data?.length:', response.data?.length);
        
        const transformed = {
          users: response.data || [],
          totalCount: response.totalCount || 0,
          totalPages: response.totalPages || 1,
          currentPage: response.currentPage || 1,
        };
        
        console.log('Transformed response:', transformed);
        console.log('=====================');
        
        return transformed;
      },
      providesTags: ["User"],
    }),

    // Get single user
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Create user
    createUser: builder.mutation({
      query: (formData) => ({
        url: "/users",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }, "User"],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => {
        console.log('=== DELETE USER API CALL ===');
        console.log('Deleting user with ID:', id);
        console.log('Full URL will be:', `/users/${id}`);
        
        return {
          url: `/users/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["User"],
      // Add error handling
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log('User deleted successfully via API');
        } catch (error) {
          console.error('Delete user API error:', error);
        }
      },
    }),

    // Toggle user status
    toggleUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }, "User"],
    }),

    // Update user account
    updateUserAccount: builder.mutation({
      query: ({ userId, accountData }) => ({
        url: `/users/${userId}/account`,
        method: "PATCH",
        body: accountData,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: "User", userId }, "User"],
    }),

    // Upload user signature
    uploadUserSignature: builder.mutation({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append("signature", file);
        return {
          url: `/users/${userId}/signature`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { userId }) => [{ type: "User", userId }, "User"],
    }),

    // Get user permissions
    getUserPermissions: builder.query({
      query: (userId) => `/users/${userId}/permissions`,
      providesTags: (result, error, userId) => [{ type: "UserPermissions", userId }],
    }),

    // Update user permissions
    updateUserPermissions: builder.mutation({
      query: ({ userId, permissions }) => ({
        url: `/users/${userId}/permissions`,
        method: "PATCH",
        body: { permissions },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: "UserPermissions", userId }],
    }),

    // Get user modules
    getUserModules: builder.query({
      query: (userId) => `/users/${userId}/modules`,
      providesTags: (result, error, userId) => [{ type: "UserModules", userId }],
    }),

    // Update user modules
    updateUserModules: builder.mutation({
      query: ({ userId, modules }) => ({
        url: `/users/${userId}/modules`,
        method: "PATCH",
        body: { modules },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: "UserModules", userId }],
    }),

    // Get user roles
    getUserRoles: builder.query({
      query: (userId) => `/users/${userId}/roles`,
      providesTags: (result, error, userId) => [{ type: "UserRoles", userId }],
    }),

    // Update user roles
    updateUserRoles: builder.mutation({
      query: ({ userId, roles }) => ({
        url: `/users/${userId}/roles`,
        method: "PATCH",
        body: { roles },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: "UserRoles", userId }, "User"],
    }),

    // Get user audit log
    getUserAuditLog: builder.query({
      query: (userId) => `/users/${userId}/audit-log`,
      providesTags: (result, error, userId) => [{ type: "UserAuditLog", userId }],
    }),

    // Get user login history
    getUserLoginHistory: builder.query({
      query: (userId) => `/users/${userId}/login-history`,
      providesTags: (result, error, userId) => [{ type: "UserLoginHistory", userId }],
    }),

    // Bulk operations
    bulkUpdateUsers: builder.mutation({
      query: ({ userIds, updates }) => ({
        url: "/users/bulk-update",
        method: "PATCH",
        body: { userIds, updates },
      }),
      invalidatesTags: ["User"],
    }),

    bulkDeleteUsers: builder.mutation({
      query: ({ userIds }) => ({
        url: "/users/bulk-delete",
        method: "DELETE",
        body: { userIds },
      }),
      invalidatesTags: ["User"],
    }),

    // Export users
    exportUsers: builder.mutation({
      query: (params) => ({
        url: "/users/export",
        method: "POST",
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Import users
    importUsers: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/users/import",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useUpdateUserAccountMutation,
  useUploadUserSignatureMutation,
  useGetUserPermissionsQuery,
  useUpdateUserPermissionsMutation,
  useGetUserModulesQuery,
  useUpdateUserModulesMutation,
  useGetUserRolesQuery,
  useUpdateUserRolesMutation,
  useGetUserAuditLogQuery,
  useGetUserLoginHistoryQuery,
  useBulkUpdateUsersMutation,
  useBulkDeleteUsersMutation,
  useExportUsersMutation,
  useImportUsersMutation,
} = userApi;
