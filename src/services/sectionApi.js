import { apiSlice } from "./apiSlice";

export const sectionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSections: builder.query({
      query: () => "/sections",
      providesTags: ["Section"],
    }),
  }),
});

export const { useGetAllSectionsQuery } = sectionApi;
