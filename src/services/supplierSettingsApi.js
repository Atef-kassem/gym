import { apiSlice } from './apiSlice';

const SUPPLIER_SETTINGS_URL = '/supplier-settings';

export const supplierSettingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dropdown Definitions APIs
    getAllDropdownDefinitions: builder.query({
      query: (filters = {}) => ({
        url: `${SUPPLIER_SETTINGS_URL}/dropdown-definitions`,
        params: filters,
      }),
      providesTags: ['DropdownDefinitions']
    }),
    
    createDropdownDefinition: builder.mutation({
      query: (definitionData) => ({
        url: `${SUPPLIER_SETTINGS_URL}/dropdown-definitions`,
        method: 'POST',
        body: definitionData,
      }),
      invalidatesTags: ['DropdownDefinitions']
    }),
    
    updateDropdownDefinition: builder.mutation({
      query: ({ id, definitionData }) => ({
        url: `${SUPPLIER_SETTINGS_URL}/dropdown-definitions/${id}`,
        method: 'PATCH',
        body: definitionData,
      }),
      invalidatesTags: ['DropdownDefinitions']
    }),
    
    deleteDropdownDefinition: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_SETTINGS_URL}/dropdown-definitions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DropdownDefinitions']
    }),
    
    toggleDefinitionStatus: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_SETTINGS_URL}/dropdown-definitions/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['DropdownDefinitions']
    }),
    
    addValueToDefinition: builder.mutation({
      query: ({ id, value }) => ({
        url: `${SUPPLIER_SETTINGS_URL}/dropdown-definitions/${id}/add-value`,
        method: 'POST',
        body: { value },
      }),
      invalidatesTags: ['DropdownDefinitions']
    }),
    
    removeValueFromDefinition: builder.mutation({
      query: ({ id, valueIndex }) => ({
        url: `${SUPPLIER_SETTINGS_URL}/dropdown-definitions/${id}/remove-value/${valueIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DropdownDefinitions']
    }),
    
    getActiveDropdownDefinitions: builder.query({
      query: (category) => `${SUPPLIER_SETTINGS_URL}/dropdown-definitions/category/${category}`,
      providesTags: ['DropdownDefinitions']
    }),

    // Supplier Categories APIs
    getAllSupplierCategories: builder.query({
      query: (filters = {}) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supplier-categories`,
        params: filters,
      }),
      providesTags: ['SupplierCategories']
    }),
    
    createSupplierCategory: builder.mutation({
      query: (categoryData) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supplier-categories`,
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['SupplierCategories']
    }),
    
    updateSupplierCategory: builder.mutation({
      query: ({ id, categoryData }) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supplier-categories/${id}`,
        method: 'PATCH',
        body: categoryData,
      }),
      invalidatesTags: ['SupplierCategories']
    }),
    
    deleteSupplierCategory: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supplier-categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupplierCategories']
    }),
    
    toggleCategoryStatus: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supplier-categories/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SupplierCategories']
    }),
    
    getActiveSupplierCategories: builder.query({
      query: () => `${SUPPLIER_SETTINGS_URL}/supplier-categories/active`,
      providesTags: ['SupplierCategories']
    }),

    // Supply Regions APIs
    getAllSupplyRegions: builder.query({
      query: (filters = {}) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supply-regions`,
        params: filters,
      }),
      providesTags: ['SupplyRegions']
    }),
    
    createSupplyRegion: builder.mutation({
      query: (regionData) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supply-regions`,
        method: 'POST',
        body: regionData,
      }),
      invalidatesTags: ['SupplyRegions']
    }),
    
    updateSupplyRegion: builder.mutation({
      query: ({ id, regionData }) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supply-regions/${id}`,
        method: 'PATCH',
        body: regionData,
      }),
      invalidatesTags: ['SupplyRegions']
    }),
    
    deleteSupplyRegion: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supply-regions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupplyRegions']
    }),
    
    toggleRegionStatus: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supply-regions/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SupplyRegions']
    }),
    
    addBranchToRegion: builder.mutation({
      query: ({ id, branchName }) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supply-regions/${id}/add-branch`,
        method: 'POST',
        body: { branchName },
      }),
      invalidatesTags: ['SupplyRegions']
    }),
    
    removeBranchFromRegion: builder.mutation({
      query: ({ id, branchIndex }) => ({
        url: `${SUPPLIER_SETTINGS_URL}/supply-regions/${id}/remove-branch/${branchIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupplyRegions']
    }),
    
    getActiveSupplyRegions: builder.query({
      query: () => `${SUPPLIER_SETTINGS_URL}/supply-regions/active`,
      providesTags: ['SupplyRegions']
    }),
    
    getRegionsByCountry: builder.query({
      query: (country) => `${SUPPLIER_SETTINGS_URL}/supply-regions/country/${country}`,
      providesTags: ['SupplyRegions']
    }),

    // Payment Terms APIs
    getAllPaymentTerms: builder.query({
      query: (filters = {}) => ({
        url: `${SUPPLIER_SETTINGS_URL}/payment-terms`,
        params: filters,
      }),
      providesTags: ['PaymentTerms']
    }),
    
    createPaymentTerm: builder.mutation({
      query: (termData) => ({
        url: `${SUPPLIER_SETTINGS_URL}/payment-terms`,
        method: 'POST',
        body: termData,
      }),
      invalidatesTags: ['PaymentTerms']
    }),
    
    updatePaymentTerm: builder.mutation({
      query: ({ id, termData }) => ({
        url: `${SUPPLIER_SETTINGS_URL}/payment-terms/${id}`,
        method: 'PATCH',
        body: termData,
      }),
      invalidatesTags: ['PaymentTerms']
    }),
    
    deletePaymentTerm: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_SETTINGS_URL}/payment-terms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentTerms']
    }),
    
    toggleTermStatus: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_SETTINGS_URL}/payment-terms/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['PaymentTerms']
    }),
    
    getActivePaymentTerms: builder.query({
      query: () => `${SUPPLIER_SETTINGS_URL}/payment-terms/active`,
      providesTags: ['PaymentTerms']
    }),
    
    getTermsByType: builder.query({
      query: (type) => `${SUPPLIER_SETTINGS_URL}/payment-terms/type/${type}`,
      providesTags: ['PaymentTerms']
    }),

    // Statistics API
    getSettingsStatistics: builder.query({
      query: () => `${SUPPLIER_SETTINGS_URL}/statistics`,
      providesTags: ['SettingsStatistics']
    }),
  }),
});

export const {
  // Dropdown Definitions
  useGetAllDropdownDefinitionsQuery,
  useCreateDropdownDefinitionMutation,
  useUpdateDropdownDefinitionMutation,
  useDeleteDropdownDefinitionMutation,
  useToggleDefinitionStatusMutation,
  useAddValueToDefinitionMutation,
  useRemoveValueFromDefinitionMutation,
  useGetActiveDropdownDefinitionsQuery,
  
  // Supplier Categories
  useGetAllSupplierCategoriesQuery,
  useCreateSupplierCategoryMutation,
  useUpdateSupplierCategoryMutation,
  useDeleteSupplierCategoryMutation,
  useToggleCategoryStatusMutation,
  useGetActiveSupplierCategoriesQuery,
  
  // Supply Regions
  useGetAllSupplyRegionsQuery,
  useCreateSupplyRegionMutation,
  useUpdateSupplyRegionMutation,
  useDeleteSupplyRegionMutation,
  useToggleRegionStatusMutation,
  useAddBranchToRegionMutation,
  useRemoveBranchFromRegionMutation,
  useGetActiveSupplyRegionsQuery,
  useGetRegionsByCountryQuery,
  
  // Payment Terms
  useGetAllPaymentTermsQuery,
  useCreatePaymentTermMutation,
  useUpdatePaymentTermMutation,
  useDeletePaymentTermMutation,
  useToggleTermStatusMutation,
  useGetActivePaymentTermsQuery,
  useGetTermsByTypeQuery,
  
  // Statistics
  useGetSettingsStatisticsQuery,
} = supplierSettingsApi;
