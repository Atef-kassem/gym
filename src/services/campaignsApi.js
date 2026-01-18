import { apiSlice } from "./apiSlice";

export const campaignsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: (params = {}) => ({ url: "/campaigns", params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((c) => ({ type: "Campaign", id: c.id })),
              { type: "Campaign", id: "LIST" },
            ]
          : [{ type: "Campaign", id: "LIST" }],
    }),
    getCampaignById: builder.query({
      query: (id) => `/campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: "Campaign", id }],
    }),
    createCampaign: builder.mutation({
      query: (body) => ({ url: "/campaigns", method: "POST", body }),
      invalidatesTags: [{ type: "Campaign", id: "LIST" }],
    }),
    updateCampaign: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/campaigns/${id}`, method: "PUT", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Campaign", id }, { type: "Campaign", id: "LIST" }],
    }),
    deleteCampaign: builder.mutation({
      query: (id) => ({ url: `/campaigns/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Campaign", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useLazyGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignsApi;


