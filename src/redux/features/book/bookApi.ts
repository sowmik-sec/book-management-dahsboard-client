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
  }),
});

export const { useCreateBookMutation } = bookApi;
