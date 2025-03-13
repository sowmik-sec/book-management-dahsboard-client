/* eslint-disable @typescript-eslint/no-explicit-any */
import BookRow from "../components/bookRow/BookRow";
import {
  useDeleteMultipleBooksMutation,
  useGetBooksQuery,
} from "../redux/features/book/bookApi";
import { useAppSelector } from "../redux/hook";
import { RootState } from "../redux/store";

const BookList = () => {
  const { data, isLoading } = useGetBooksQuery({ searchTerm: "" });
  const [deleteMultiple, { isSuccess: isMultipleDeleteSuccess }] =
    useDeleteMultipleBooksMutation();
  const bookIds = useAppSelector((state: RootState) => state.book.bookIds);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  console.log(data.data.result);
  const handleMultipleDelete = () => {
    console.log(bookIds);
    deleteMultiple({ bookIds });
    if (isMultipleDeleteSuccess) {
      alert("Books deleted successfully");
    }
  };

  return (
    <div>
      Book list page
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
          {data?.data?.result?.map((book: any) => (
            <BookRow {...book} key={book._id} />
          ))}
        </table>
        {bookIds.length && (
          <button onClick={handleMultipleDelete} className="btn btn-ghost">
            Delete Multiple Books
          </button>
        )}
      </div>
    </div>
  );
};

export default BookList;
