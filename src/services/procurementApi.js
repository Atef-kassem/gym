import { apiSlice } from "./apiSlice";

export const procurementApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// RFQs
		listRFQs: builder.query({
			query: (params = {}) => ({ url: "/rfqs", params }),
			providesTags: (result) => [{ type: "RFQ", id: "LIST" }, ...(result?.rfqs || []).map((r) => ({ type: "RFQ", id: r.id }))],
		}),
		getRFQ: builder.query({
			query: (id) => `/rfqs/${id}`,
			providesTags: (result, error, id) => [{ type: "RFQ", id }],
		}),
		createRFQ: builder.mutation({
			query: (body) => ({ url: "/rfqs", method: "POST", body }),
			invalidatesTags: [{ type: "RFQ", id: "LIST" }],
		}),
		updateRFQ: builder.mutation({
			query: ({ id, ...body }) => ({ url: `/rfqs/${id}`, method: "PUT", body }),
			invalidatesTags: (r, e, { id }) => [{ type: "RFQ", id }, { type: "RFQ", id: "LIST" }],
		}),
		addRFQItem: builder.mutation({
			query: ({ id, ...body }) => ({ url: `/rfqs/${id}/items`, method: "POST", body }),
			invalidatesTags: (r, e, { id }) => [{ type: "RFQ", id }],
		}),
		getRFQItems: builder.query({
			query: (id) => `/rfqs/${id}/items`,
			providesTags: (r, e, id) => [{ type: "RFQ", id }],
		}),

		// Quotations
		listQuotations: builder.query({
			query: (params = {}) => ({ url: "/quotations", params }),
			providesTags: (result) => [{ type: "Quotation", id: "LIST" }, ...(result || []).map((q) => ({ type: "Quotation", id: q.id }))],
		}),
		getQuotation: builder.query({
			query: (id) => `/quotations/${id}`,
			providesTags: (r, e, id) => [{ type: "Quotation", id }],
		}),
		createQuotation: builder.mutation({
			query: (body) => ({ url: "/quotations", method: "POST", body }),
			invalidatesTags: [{ type: "Quotation", id: "LIST" }],
		}),
		updateQuotation: builder.mutation({
			query: ({ id, ...body }) => ({ url: `/quotations/${id}`, method: "PUT", body }),
			invalidatesTags: (r, e, { id }) => [{ type: "Quotation", id }, { type: "Quotation", id: "LIST" }],
		}),
		deleteQuotation: builder.mutation({
			query: (id) => ({ url: `/quotations/${id}`, method: "DELETE" }),
			invalidatesTags: [{ type: "Quotation", id: "LIST" }],
		}),

		// Requisitions
		listRequisitions: builder.query({
			query: (params = {}) => ({ url: "/requisitions", params }),
			providesTags: (result) => [{ type: "Requisition", id: "LIST" }, ...(result?.data || []).map((r) => ({ type: "Requisition", id: r.id }))],
		}),
		createRequisition: builder.mutation({
			query: (body) => ({ url: "/requisitions", method: "POST", body }),
			invalidatesTags: [{ type: "Requisition", id: "LIST" }],
		}),
		getRequisition: builder.query({
			query: (id) => `/requisitions/${id}`,
			providesTags: (r, e, id) => [{ type: "Requisition", id }],
		}),
		updateRequisition: builder.mutation({
			query: ({ id, ...body }) => ({ url: `/requisitions/${id}`, method: "PUT", body }),
			invalidatesTags: (r, e, { id }) => [{ type: "Requisition", id }, { type: "Requisition", id: "LIST" }],
		}),

		// Approvals
		listApprovals: builder.query({
			query: (params = {}) => ({ url: "/approvals", params }),
			providesTags: [{ type: "Approval", id: "LIST" }],
		}),
		actionApproval: builder.mutation({
			query: ({ id, action, notes }) => ({ url: `/approvals/${id}`, method: "POST", body: { action, notes } }),
			invalidatesTags: [{ type: "Approval", id: "LIST" }],
		}),

		// Settings
		getProcurementSettings: builder.query({
			query: () => "/procurement-settings",
			providesTags: [{ type: "ProcurementSettings", id: "SINGLE" }],
		}),
		saveProcurementSettings: builder.mutation({
			query: (body) => ({ url: "/procurement-settings", method: "PUT", body }),
			invalidatesTags: [{ type: "ProcurementSettings", id: "SINGLE" }],
		}),

		// Lookup search
		searchItems: builder.query({
			query: ({ type, q }) => ({ url: "/procurement/search", params: { type, q } }),
		}),
	}),
	overrides: {
		tagTypes: [
			"RFQ",
			"Quotation",
			"Requisition",
			"Approval",
			"ProcurementSettings",
		],
	},
});

export const {
	useListRFQsQuery,
	useGetRFQQuery,
	useCreateRFQMutation,
	useUpdateRFQMutation,
	useAddRFQItemMutation,
	useGetRFQItemsQuery,
	useListQuotationsQuery,
	useGetQuotationQuery,
	useCreateQuotationMutation,
	useUpdateQuotationMutation,
	useDeleteQuotationMutation,
	useListRequisitionsQuery,
	useCreateRequisitionMutation,
	useGetRequisitionQuery,
	useUpdateRequisitionMutation,
	useListApprovalsQuery,
	useActionApprovalMutation,
	useGetProcurementSettingsQuery,
	useSaveProcurementSettingsMutation,
	useSearchItemsQuery,
} = procurementApi;


