import { apiSlice } from "./apiSlice";

export const serviceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => "/services",
      providesTags: ["Service"],
    }),
    getActiveServices: builder.query({
      query: () => "/services/active",
      providesTags: ["Service"],
    }),
    getServicesByBranch: builder.query({
      query: (branchId) => `/services/branch/${branchId}`,
      providesTags: (result, error, branchId) => [
        { type: "Service", id: `branch-${branchId}` },
      ],
    }),
    getServiceById: builder.query({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),
    calculateServicePrice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/services/${id}/calculate-price`,
        method: "POST",
        body: data,
      }),
    }),
    createService: builder.mutation({
      query: (newService) => {
        // إذا كان FormData، لا نضع headers (سيتم تعيينها تلقائياً)
        const isFormData = newService instanceof FormData;
        
        return {
          url: "/services",
          method: "POST",
          body: newService,
          // لا نضع Content-Type للـ FormData
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation({
      query: ({ id, updatedService }) => {
        // إذا كان FormData، لا نضع headers (سيتم تعيينها تلقائياً)
        const isFormData = updatedService instanceof FormData;
        
        return {
          url: `/services/${id}`,
          method: "PUT",
          body: updatedService,
          // لا نضع Content-Type للـ FormData
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Service", id },
        "Service",
      ],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetActiveServicesQuery,
  useGetServicesByBranchQuery,
  useGetServiceByIdQuery,
  useCalculateServicePriceMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
