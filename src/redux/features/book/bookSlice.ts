import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookState {
  bookIds: string[];
}

const initialState: BookState = {
  bookIds: [],
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    toggleBookId: (state, action: PayloadAction<string>) => {
      if (!state.bookIds.includes(action.payload)) {
        state.bookIds.push(action.payload);
      } else {
        const id = action.payload;
        state.bookIds = state.bookIds.filter((bookId) => bookId !== id);
      }
    },
  },
});

export const { toggleBookId } = bookSlice.actions;
export default bookSlice.reducer;
