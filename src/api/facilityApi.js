// src/features/api/facilityApi.js
import { baseApi } from "./baseApi";

export const facilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFacilities: builder.query({
      query: () => "/api/user/get-all-facilites",
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllFacilitiesQuery } = facilityApi;
