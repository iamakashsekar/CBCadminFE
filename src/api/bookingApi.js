// src/features/api/bookingApi.js
import { baseApi } from "./baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => "api/user/get-all-bookings",
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllBookingsQuery } = bookingApi;
