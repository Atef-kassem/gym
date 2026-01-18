import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // تسجيل الدخول
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // تسجيل مستخدم جديد
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // نسيان كلمة المرور
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/forgotpassword',
        method: 'POST',
        body: { email },
      }),
    }),

    // إعادة تعيين كلمة المرور
    resetPassword: builder.mutation({
      query: ({ token, password, passwordConfirm }) => ({
        url: `/auth/restpassword/${token}`,
        method: 'PATCH',
        body: { password, passwordConfirm },
      }),
    }),

    // تحديث كلمة المرور
    updatePassword: builder.mutation({
      query: ({ currentPassword, newPassword, passwordConfirm }) => ({
        url: '/auth/updatepassword',
        method: 'PATCH',
        body: { currentPassword, newPassword, passwordConfirm },
      }),
    }),

    // الحصول على بيانات المستخدم الحالي
    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // تحديث بيانات المستخدم
    updateMyData: builder.mutation({
      query: (userData) => ({
        url: '/auth/updatemydata',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useGetCurrentUserQuery,
  useUpdateMyDataMutation,
} = authApi;
