import { apiSlice } from "./apiSlice";

export const rolePermissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRolePermissions: builder.query({
      query: () => "/rolepermissions",
      providesTags: ["RolePermission"],
    }),
  }),
});

export const { useGetAllRolePermissionsQuery } = rolePermissionApi;
