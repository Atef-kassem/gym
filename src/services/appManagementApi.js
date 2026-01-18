import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com';

export const appManagementApi = createApi({
  reducerPath: 'appManagementApi',
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
  tagTypes: ['AboutApp', 'Invitation', 'AppOffer', 'AppTrainer', 'ExerciseCategory', 'AppExercise', 'AppNews', 'AppAd'],
  endpoints: (builder) => ({
    // Upload image for app content
    uploadAppImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: "/app/upload-image",
          method: "POST",
          body: formData,
        };
      },
    }),
    // About App
    getAboutApp: builder.query({
      query: () => "/app/about",
      providesTags: ["AboutApp"],
    }),
    updateAboutApp: builder.mutation({
      query: (data) => ({
        url: "/app/about",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AboutApp"],
    }),
    // Invitations
    getAllInvitations: builder.query({
      query: (params) => ({
        url: "/app/invitations",
        params,
      }),
      providesTags: ["Invitation"],
    }),
    getInvitationsByStatus: builder.query({
      query: (status) => `/app/invitations/status/${status}`,
      providesTags: ["Invitation"],
    }),
    createInvitation: builder.mutation({
      query: (data) => ({
        url: "/app/invitations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invitation"],
    }),
    updateInvitation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/app/invitations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Invitation"],
    }),
    // Offers
    getAllOffers: builder.query({
      query: (params) => ({
        url: "/app/offers",
        params,
      }),
      providesTags: ["AppOffer"],
    }),
    createOffer: builder.mutation({
      query: (data) => ({
        url: "/app/offers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AppOffer"],
    }),
    updateOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/app/offers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AppOffer"],
    }),
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `/app/offers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppOffer"],
    }),
    // Trainers
    getAllTrainers: builder.query({
      query: (params) => ({
        url: "/app/trainers",
        params,
      }),
      providesTags: ["AppTrainer"],
    }),
    createTrainer: builder.mutation({
      query: (data) => ({
        url: "/app/trainers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AppTrainer"],
    }),
    updateTrainer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/app/trainers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AppTrainer"],
    }),
    deleteTrainer: builder.mutation({
      query: (id) => ({
        url: `/app/trainers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppTrainer"],
    }),
    // Exercise Categories
    getAllExerciseCategories: builder.query({
      query: () => "/app/exercise-categories",
      providesTags: ["ExerciseCategory"],
    }),
    createExerciseCategory: builder.mutation({
      query: (data) => ({
        url: "/app/exercise-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ExerciseCategory"],
    }),
    updateExerciseCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/app/exercise-categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ExerciseCategory"],
    }),
    deleteExerciseCategory: builder.mutation({
      query: (id) => ({
        url: `/app/exercise-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExerciseCategory"],
    }),
    // Exercises
    getAllExercises: builder.query({
      query: (params) => ({
        url: "/app/exercises",
        params,
      }),
      providesTags: ["AppExercise"],
    }),
    createExercise: builder.mutation({
      query: (data) => ({
        url: "/app/exercises",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AppExercise"],
    }),
    updateExercise: builder.mutation({
      query: ({ id, data }) => ({
        url: `/app/exercises/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AppExercise"],
    }),
    deleteExercise: builder.mutation({
      query: (id) => ({
        url: `/app/exercises/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppExercise"],
    }),
    // News
    getAllNews: builder.query({
      query: (params) => ({
        url: "/app/news",
        params,
      }),
      providesTags: ["AppNews"],
    }),
    createNews: builder.mutation({
      query: (data) => ({
        url: "/app/news",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AppNews"],
    }),
    updateNews: builder.mutation({
      query: ({ id, data }) => ({
        url: `/app/news/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AppNews"],
    }),
    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/app/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppNews"],
    }),
    // Ads
    getAllAds: builder.query({
      query: (params) => ({
        url: "/app/ads",
        params,
      }),
      providesTags: ["AppAd"],
    }),
    createAd: builder.mutation({
      query: (data) => ({
        url: "/app/ads",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AppAd"],
    }),
    updateAd: builder.mutation({
      query: ({ id, data }) => ({
        url: `/app/ads/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AppAd"],
    }),
    deleteAd: builder.mutation({
      query: (id) => ({
        url: `/app/ads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppAd"],
    }),
  }),
});

export const {
  useUploadAppImageMutation,
  useGetAboutAppQuery,
  useUpdateAboutAppMutation,
  useGetAllInvitationsQuery,
  useGetInvitationsByStatusQuery,
  useCreateInvitationMutation,
  useUpdateInvitationMutation,
  useGetAllOffersQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useGetAllTrainersQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
  useGetAllExerciseCategoriesQuery,
  useCreateExerciseCategoryMutation,
  useUpdateExerciseCategoryMutation,
  useDeleteExerciseCategoryMutation,
  useGetAllExercisesQuery,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation,
  useGetAllNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useGetAllAdsQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
} = appManagementApi;

