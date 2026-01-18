import { apiSlice } from "./apiSlice";

export const goodsReceiptApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listGoodsReceipts: builder.query({
      query: (params = {}) => ({ url: "/goods-receipts", params }),
    }),
    getGoodsReceipt: builder.query({
      query: (id) => ({ url: `/goods-receipts/${id}` }),
    }),
    createGoodsReceipt: builder.mutation({
      query: (body) => ({ url: "/goods-receipts", method: "POST", body }),
    }),
    updateGoodsReceipt: builder.mutation({
      query: ({ id, body }) => ({ url: `/goods-receipts/${id}`, method: "PUT", body }),
    }),
  }),
});

export const { useListGoodsReceiptsQuery, useGetGoodsReceiptQuery, useCreateGoodsReceiptMutation, useUpdateGoodsReceiptMutation } = goodsReceiptApi;


