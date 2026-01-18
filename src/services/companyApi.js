import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE_URL}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Company', 'CompanyAttachments', 'CompanyAccount'],
  endpoints: (builder) => ({
    // Get all companies
    getAllCompanies: builder.query({
      query: () => '/companies',
      providesTags: ['Company'],
    }),

    // Get current company
    getCurrentCompany: builder.query({
      query: () => '/companies/current',
      providesTags: ['Company'],
    }),

    // Get company by ID
    getCompany: builder.query({
      query: (id) => `/companies/${id}`,
      providesTags: ['Company'],
    }),

    // Update company
    updateCompany: builder.mutation({
      query: ({ id, data }) => ({
        url: `/companies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Company'],
    }),

    // Get company attachments
    getCompanyAttachments: builder.query({
      query: ({ id, fileType }) => ({
        url: `/companies/${id}/attachments`,
        params: fileType ? { fileType } : undefined,
      }),
      providesTags: ['CompanyAttachments'],
    }),

    // Upload company attachment
    uploadAttachment: builder.mutation({
      query: ({ id, fileType, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);

        return {
          url: `/companies/${id}/attachments`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['CompanyAttachments'],
    }),

    // Delete company attachment
    deleteAttachment: builder.mutation({
      query: ({ id, attachmentId }) => ({
        url: `/companies/${id}/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CompanyAttachments'],
    }),

    // Get company account
    getCompanyAccount: builder.query({
      query: (id) => `/companies/${id}/account`,
      providesTags: ['CompanyAccount'],
    }),

    // Create or update company account
    upsertCompanyAccount: builder.mutation({
      query: ({ id, data }) => ({
        url: `/companies/${id}/account`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CompanyAccount'],
    }),

    // Update company account password
    updateAccountPassword: builder.mutation({
      query: ({ id, currentPassword, newPassword }) => ({
        url: `/companies/${id}/account/password`,
        method: 'PUT',
        body: { currentPassword, newPassword },
      }),
      invalidatesTags: ['CompanyAccount'],
    }),
  }),
});

export const {
  useGetAllCompaniesQuery,
  useGetCurrentCompanyQuery,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useGetCompanyAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetCompanyAccountQuery,
  useUpsertCompanyAccountMutation,
  useUpdateAccountPasswordMutation,
} = companyApi;
