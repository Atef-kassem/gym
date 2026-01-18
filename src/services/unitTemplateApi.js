import { apiSlice } from "./apiSlice";

export const unitTemplateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUnitTemplates: builder.query({
      query: (params = {}) => ({
        url: "/unit-templates",
        params: {
          limit: 1000,
          page: 1,
          ...params
        }
      }),
      providesTags: ["UnitTemplate"],
    }),
    createUnitTemplate: builder.mutation({
      query: (template) => ({
        url: "/unit-templates",
        method: "POST",
        body: template,
      }),
      invalidatesTags: ["UnitTemplate"],
    }),
    getUnitTemplate: builder.query({
      query: (id) => `/unit-templates/${id}`,
      providesTags: (result, error, id) => [{ type: "UnitTemplate", id }],
    }),
    updateUnitTemplate: builder.mutation({
      query: ({ id, updatedTemplate }) => ({
        url: `/unit-templates/${id}`,
        method: "PATCH",
        body: updatedTemplate,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "UnitTemplate", id },
        "UnitTemplate",
      ],
    }),
    deleteUnitTemplate: builder.mutation({
      query: (id) => ({
        url: `/unit-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UnitTemplate"],
    }),
    getTemplatesByCategory: builder.query({
      query: (category) => `/unit-templates/category/${category}`,
      providesTags: ["UnitTemplate"],
    }),
    getActiveTemplates: builder.query({
      query: () => "/unit-templates/active",
      providesTags: ["UnitTemplate"],
    }),
    incrementUsageCount: builder.mutation({
      query: (id) => ({
        url: `/unit-templates/${id}/increment-usage`,
        method: "POST",
      }),
      invalidatesTags: ["UnitTemplate"],
    }),
  }),
});

export const {
  useGetAllUnitTemplatesQuery,
  useCreateUnitTemplateMutation,
  useGetUnitTemplateQuery,
  useUpdateUnitTemplateMutation,
  useDeleteUnitTemplateMutation,
  useGetTemplatesByCategoryQuery,
  useGetActiveTemplatesQuery,
  useIncrementUsageCountMutation,
} = unitTemplateApi;
