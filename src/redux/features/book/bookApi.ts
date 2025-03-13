import { baseApi } from "../../api/baseApi";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBook: builder.mutation({
      query: (bookInfo) => ({
        url: "/books/create-book",
        method: "POST",
        body: bookInfo,
      }),
      invalidatesTags: ["createBook"],
    }),
    getBooks: builder.query({
      query: (queryParams: Record<string, unknown>) => ({
        url: "/books/",
        method: "GET",
        params: {
          ...queryParams,
          page: queryParams.page,
          limit: queryParams.limit,
          minPrice: queryParams.minPrice,
          maxPrice: queryParams.maxPrice,
          minPageCount: queryParams.minPageCount,
          maxPageCount: queryParams.maxPageCount,
          startDate: queryParams.startDate,
          endDate: queryParams.endDate,
        },
      }),
      providesTags: ["deleteBookById", "createBook"],
    }),
    deleteSingleBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deleteBookById"],
    }),
  }),
});

export const {
  useCreateBookMutation,
  useGetBooksQuery,
  useDeleteSingleBookMutation,
} = bookApi;
