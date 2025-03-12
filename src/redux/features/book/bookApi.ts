import { baseApi } from "../../api/baseApi";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBook: builder.mutation({
      query: (bookInfo) => ({
        url: "/books/create-book",
        method: "POST",
        body: bookInfo,
      }),
    }),
    getBooks: builder.query({
      query: () => ({
        url: "/books/",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateBookMutation, useGetBooksQuery } = bookApi;
