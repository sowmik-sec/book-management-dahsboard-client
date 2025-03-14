import { baseApi } from "../../api/baseApi";

const saleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSale: builder.mutation({
      query: (saleInfo) => ({
        url: "/sales/create-sale",
        method: "POST",
        body: saleInfo,
      }),
      invalidatesTags: ["sale"],
    }),
    getSaleHistory: builder.query({
      query: (params) => ({
        url: "/sales/",
        method: "GET",
        params: {
          period: params.period || "month",
          sortBy: params.sortBy || "_id",
          sortOrder: params.sortOrder || "desc",
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
    }),
  }),
});

export const { useCreateSaleMutation, useGetSaleHistoryQuery } = saleApi;
