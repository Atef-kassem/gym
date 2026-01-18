import { apiSlice } from "./apiSlice";

export const surveyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSurveys: builder.query({
      query: (params) => ({ url: "/surveys", params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((s) => ({ type: "Survey", id: s.id })),
              { type: "Survey", id: "LIST" },
            ]
          : [{ type: "Survey", id: "LIST" }],
    }),
    getSurveyById: builder.query({
      query: (id) => ({ url: `/surveys/${id}` }),
      providesTags: (result, error, id) => [{ type: "Survey", id }],
    }),
    createSurvey: builder.mutation({
      query: (body) => ({ url: "/surveys", method: "POST", body }),
      invalidatesTags: [{ type: "Survey", id: "LIST" }],
    }),
    updateSurvey: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/surveys/${id}`, method: "PUT", body }),
      invalidatesTags: (r, e, arg) => [{ type: "Survey", id: arg.id }],
    }),
    deleteSurvey: builder.mutation({
      query: (id) => ({ url: `/surveys/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Survey", id: "LIST" }],
    }),
    updateSurveyStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/surveys/${id}/status`, method: "PUT", body: { status } }),
      invalidatesTags: (r, e, arg) => [{ type: "Survey", id: arg.id }],
    }),
    getSurveyAnalytics: builder.query({
      query: (id) => ({ url: `/surveys/${id}/analytics` }),
      providesTags: (result, error, id) => [{ type: "Survey", id }],
    }),
    getSurveyResponses: builder.query({
      query: (params) => ({ url: "/surveys/responses", params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((r) => ({ type: "SurveyResponse", id: r.id })),
              { type: "SurveyResponse", id: "LIST" },
            ]
          : [{ type: "SurveyResponse", id: "LIST" }],
    }),
    createSurveyResponse: builder.mutation({
      query: (body) => ({ url: "/surveys/responses", method: "POST", body }),
      invalidatesTags: [{ type: "SurveyResponse", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSurveysQuery,
  useGetSurveyByIdQuery,
  useCreateSurveyMutation,
  useUpdateSurveyMutation,
  useDeleteSurveyMutation,
  useUpdateSurveyStatusMutation,
  useGetSurveyAnalyticsQuery,
  useGetSurveyResponsesQuery,
  useCreateSurveyResponseMutation,
} = surveyApi;
