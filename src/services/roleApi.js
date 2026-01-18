import { apiSlice } from "./apiSlice";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: () => "/roles",
      providesTags: ["Role"],
    }),
    createRole: builder.mutation({
      query: (newRole) => ({
        url: "/roles",
        method: "POST",
        body: newRole,
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const { useGetAllRolesQuery, useCreateRoleMutation } = roleApi;
