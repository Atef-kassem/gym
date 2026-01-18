import { apiSlice } from "./apiSlice";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTimeSlots: builder.query({
      query: ({ branchId, date }) => `/bookings/time-slots?branchId=${branchId}&date=${date}`,
      providesTags: ["Booking"],
    }),
    checkAvailability: builder.query({
      query: ({ branchId, date, time }) => `/bookings/availability?branchId=${branchId}&date=${date}&time=${time}`,
      providesTags: ["Booking"],
    }),
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),
    getAllBookings: builder.query({
      query: ({ branchId, date, status } = {}) => {
        const params = new URLSearchParams();
        if (branchId) params.append('branchId', branchId);
        if (date) params.append('date', date);
        if (status) params.append('status', status);
        return `/bookings?${params.toString()}`;
      },
      providesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetTimeSlotsQuery,
  useCheckAvailabilityQuery,
  useCreateBookingMutation,
  useGetAllBookingsQuery,
} = bookingApi;
