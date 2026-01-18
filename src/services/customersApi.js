import { apiSlice } from "./apiSlice";

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: (params = {}) => ({ url: "/customers", params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((c) => ({ type: "Customer", id: c.id })),
              { type: "Customer", id: "LIST" },
            ]
          : [{ type: "Customer", id: "LIST" }],
    }),
    getCustomerById: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
    createCustomer: builder.mutation({
      query: (body) => ({ url: "/customers", method: "POST", body }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/customers/${id}`, method: "PUT", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Customer", id }],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({ url: `/customers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;


