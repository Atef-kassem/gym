import { apiSlice } from "./apiSlice";

export const permissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPermissions: builder.query({
      query: () => "/permissions",
      providesTags: ["Permission"],
    }),
    createPermission: builder.mutation({
      query: (newPermission) => ({
        url: "/permissions",
        method: "POST",
        body: newPermission,
      }),
      invalidatesTags: ["Permission"],
    }),
  }),
});

export const { useGetAllPermissionsQuery, useCreatePermissionMutation } =
  permissionApi;
