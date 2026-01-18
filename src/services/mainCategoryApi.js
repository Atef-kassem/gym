import { apiSlice } from "./apiSlice";

export const mainCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMainCategories: builder.query({
      query: () => "/main-categories",
      providesTags: ["MainCategory"],
    }),
    getMainCategoryById: builder.query({
      query: (id) => `/main-categories/${id}`,
      providesTags: (result, error, id) => [{ type: "MainCategory", id }],
    }),
  }),
});

export const { useGetAllMainCategoriesQuery, useGetMainCategoryByIdQuery } = mainCategoryApi;


