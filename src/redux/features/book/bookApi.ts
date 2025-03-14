import { baseApi } from "../../api/baseApi";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBook: builder.mutation({
      query: (bookInfo) => ({
        url: "/books/create-book",
        method: "POST",
        body: bookInfo,
      }),
      invalidatesTags: ["book"],
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
      providesTags: ["book", "sale"],
    }),
    updateSingleBook: builder.mutation({
      query: ({ id, ...book }) => ({
        url: `/books/${id}`,
        method: "PATCH",
        body: book,
      }),
      invalidatesTags: ["book"],
    }),
    deleteSingleBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["book"],
    }),
    deleteMultipleBooks: builder.mutation({
      query: (bookIds) => ({
        url: "/books/delete-multiple-books",
        method: "DELETE",
        body: bookIds,
      }),
      invalidatesTags: ["book"],
    }),
  }),
});

export const {
  useCreateBookMutation,
  useGetBooksQuery,
  useUpdateSingleBookMutation,
  useDeleteSingleBookMutation,
  useDeleteMultipleBooksMutation,
} = bookApi;
