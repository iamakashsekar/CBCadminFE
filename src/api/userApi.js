// src/features/api/userApi.js
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "api/user/get-all-users",
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllUsersQuery } = userApi;
