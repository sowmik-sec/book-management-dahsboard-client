/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import BookRow, { BookData } from "../components/bookRow/BookRow";
import {
  useDeleteMultipleBooksMutation,
  useGetBooksQuery,
} from "../redux/features/book/bookApi";
import { useAppSelector } from "../redux/hook";
import { RootState } from "../redux/store";
import BookModal, { BookFormData } from "../components/bookModal/BookModal";

const BookList = () => {
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetBooksQuery({ searchTerm: search });
  const [deleteMultiple, { isSuccess: isMultipleDeleteSuccess }] =
    useDeleteMultipleBooksMutation();
  const bookIds = useAppSelector((state: RootState) => state.book.bookIds);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "duplicate">(
    "create"
  );

  const handleEdit = (book: BookData) => {
    setSelectedBook(book);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDuplicate = (book: BookData) => {
    setSelectedBook(book);
    setModalMode("duplicate");
    setModalOpen(true);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  const handleMultipleDelete = () => {
    console.log(bookIds);
    deleteMultiple({ bookIds });
    if (isMultipleDeleteSuccess) {
      alert("Books deleted successfully");
    }
  };

  const handleSearch = () => {
    setSearch(searchText);
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <div>
          <input
            type="text"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="px-3 py-2 rounded-md  border-2 border-blue-400"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <>
            <tr>
              <th></th>
              <td>name</td>
              <td>author</td>
              <td>publisher</td>
              <td>Genre</td>
              <td>price</td>
              <td>pageCount</td>
              <td>format</td>
              <td>quantity</td>
              <td>language</td>
              <td>Release Date</td>
              <td>Isbn</td>
              <td>series</td>
              <th>edit</th>
              <th>duplicate</th>
              <th>delete</th>
            </tr>
          </>
          {data?.data?.result?.map((book: BookFormData) => (
            <BookRow
              {...book}
              key={book._id}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
            />
          ))}
        </table>
        {bookIds.length && (
          <button onClick={handleMultipleDelete} className="btn btn-ghost">
            Delete Multiple Books
          </button>
        )}
        <BookModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          book={selectedBook}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default BookList;
