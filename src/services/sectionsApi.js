import { apiSlice } from "./apiSlice";

export const sectionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all sections
    getSections: builder.query({
      query: () => "/sections",
      transformResponse: (response) => response.data || [],
      providesTags: ["Sections"],
    }),

    // Get sections by branch
    getSectionsByBranch: builder.query({
      query: (branchId) => `/sections?branchId=${branchId}`,
      transformResponse: (response) => response.data || [],
      providesTags: (result, error, branchId) => [{ type: "SectionsByBranch", branchId }],
    }),
  }),
});

export const {
  useGetSectionsQuery,
  useGetSectionsByBranchQuery,
} = sectionsApi;
