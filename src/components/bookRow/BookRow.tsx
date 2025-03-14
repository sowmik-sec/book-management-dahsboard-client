import { FC } from "react";
import { useDeleteSingleBookMutation } from "../../redux/features/book/bookApi";
import { toggleBookId } from "../../redux/features/book/bookSlice";
import { useAppDispatch } from "../../redux/hook";
import SaleModal from "../saleModal/SaleModal";
export interface BookData {
  _id: string;
  name: string;
  author: string;
  price: number;
  releaseDate: string;
  publisher: string;
  isbn: string;
  language: string;
  series?: string;
  genres: { genre: string; isDeleted: boolean }[];
  format: BookFormat;
  pageCount: number;
  quantity: number;
}
interface BookRowProps extends BookData {
  onEdit: (book: BookData) => void;
  onDuplicate: (book: BookData) => void;
}

export enum BookFormat {
  Hardcover = "hardcover",
  Paperback = "paperback",
  EBook = "e-book",
  Audiobook = "audiobook",
}
export type TGenre = {
  genre: string;
  isDeleted: boolean;
};

export type TBook = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  releaseDate: Date;
  author: string;
  isbn?: string;
  genres: [TGenre];
  publisher: string;
  series?: string;
  language: string;
  format: BookFormat;
  pageCount: number;
};

const BookRow: FC<BookRowProps> = ({
  _id,
  name,
  author,
  price,
  releaseDate,
  publisher,
  isbn,
  language,
  series,
  genres,
  format,
  pageCount,
  quantity,
  onEdit,
  onDuplicate,
}) => {
  const [deleteSingleBook, { isSuccess: isSingleDeleteSuccess }] =
    useDeleteSingleBookMutation();
  const dispatch = useAppDispatch();
  // const {
  //   _id,
  //   name,
  //   price,
  //   quantity,
  //   author,
  //   publisher,
  //   format,
  //   pageCount,
  //   genres,
  //   language,
  //   releaseDate,
  //   isbn,
  //   series,
  // } = book;

  const date = new Date(releaseDate);
  const year = date.getFullYear();
  const month = date.getMonth();

  const handleSingleDelete = (id: string) => {
    console.log(id);
    deleteSingleBook(id);
    if (isSingleDeleteSuccess) {
      alert("Book Deleted successfully");
    }
  };
  const bookData: BookData = {
    _id,
    name,
    author,
    price,
    releaseDate,
    publisher,
    isbn,
    language,
    series,
    genres,
    format,
    pageCount,
    quantity,
  };
  return (
    <tbody>
      <tr>
        <th>
          <label>
            <input
              onClick={() => dispatch(toggleBookId(_id))}
              type="checkbox"
              className="checkbox checkbox-secondary"
            />
          </label>
        </th>
        <td>{name}</td>
        <td>{author}</td>
        <td>{publisher}</td>
        <td>
          <p className="flex mr-2">{genres?.map((genre) => genre.genre)}</p>
        </td>
        <td>{price}</td>
        <td>{pageCount}</td>
        <td>{format}</td>
        <td>{quantity}</td>
        <td>{language}</td>
        <td>{`${month}-${year}`}</td>
        <td>{isbn}</td>
        <td>{series}</td>
        <th>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              const modal = document?.getElementById(
                "sale_modal"
              ) as HTMLDialogElement;
              if (modal) {
                modal.showModal();
              }
            }}
          >
            Sale
          </button>
        </th>
        <th>
          <button
            onClick={() => onEdit(bookData)}
            className="btn btn-ghost btn-xs"
          >
            edit
          </button>
        </th>
        <th>
          <button
            onClick={() => onDuplicate(bookData)}
            className="btn btn-ghost btn-info btn-xs"
          >
            duplicate
          </button>
        </th>
        <th>
          <button
            onClick={() => handleSingleDelete(_id)}
            className="btn btn-ghost btn-error btn-xs"
          >
            delete
          </button>
        </th>
      </tr>
      <SaleModal id={_id} name={name} quantity={quantity} />
    </tbody>
  );
};

export default BookRow;
