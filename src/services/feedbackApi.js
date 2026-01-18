import { apiSlice } from "./apiSlice";

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeedbacks: builder.query({
      query: (params) => ({ url: "/feedbacks", params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((f) => ({ type: "Feedback", id: f.id })),
              { type: "Feedback", id: "LIST" },
            ]
          : [{ type: "Feedback", id: "LIST" }],
    }),
    createFeedback: builder.mutation({
      query: (body) => ({ url: "/feedbacks", method: "POST", body }),
      invalidatesTags: [{ type: "Feedback", id: "LIST" }],
    }),
    updateFeedback: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/feedbacks/${id}`, method: "PUT", body }),
      invalidatesTags: (r, e, arg) => [{ type: "Feedback", id: arg.id }],
    }),
    deleteFeedback: builder.mutation({
      query: (id) => ({ url: `/feedbacks/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Feedback", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} = feedbackApi;


