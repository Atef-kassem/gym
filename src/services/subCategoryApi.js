import { apiSlice } from "./apiSlice";

export const subCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubCategories: builder.query({
      query: () => "/sub-categories",
      providesTags: ["SubCategory"],
    }),
    getSubCategoriesByMain: builder.query({
      query: (mainCategoryId) => `/sub-categories/main-category/${mainCategoryId}`,
      providesTags: (result, error, id) => [{ type: "SubCategory", id }],
    }),
  }),
});

export const { useGetAllSubCategoriesQuery, useGetSubCategoriesByMainQuery } = subCategoryApi;


