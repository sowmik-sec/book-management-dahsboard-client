/* eslint-disable @typescript-eslint/no-explicit-any */
import BookRow from "../components/bookRow/BookRow";
import { useGetBooksQuery } from "../redux/features/book/bookApi";

const BookList = () => {
  const { data, isLoading } = useGetBooksQuery({ searchTerm: "" });
  if (isLoading) {
    return <p>Loading...</p>;
  }
  console.log(data.data.result);
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
      </div>
    </div>
  );
};

export default BookList;
