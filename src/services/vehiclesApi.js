import { apiSlice } from "./apiSlice";

export const vehiclesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: (params = {}) => ({ url: "/vehicles", params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((v) => ({ type: "Vehicle", id: `${v.id}` })),
              { type: "Vehicle", id: "LIST" },
            ]
          : [{ type: "Vehicle", id: "LIST" }],
    }),
  }),
});

export const { useGetVehiclesQuery, useLazyGetVehiclesQuery } = vehiclesApi;


