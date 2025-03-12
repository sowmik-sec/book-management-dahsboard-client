import { useGetBooksQuery } from "../redux/features/book/bookApi";

const BookList = () => {
  const { data } = useGetBooksQuery({ searchTerm: "", limit: 3 });
  console.log(data);
  return <div>Book list page</div>;
};

export default BookList;
