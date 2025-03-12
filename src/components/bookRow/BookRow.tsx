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

const BookRow = (book: TBook) => {
  const {
    name,
    price,
    quantity,
    author,
    publisher,
    format,
    pageCount,
    genres,
    language,
    releaseDate,
    isbn,
    series,
  } = book;
  const date = new Date(releaseDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  return (
    <tbody>
      <tr>
        <th>
          <label>
            <input type="checkbox" className="checkbox checkbox-secondary" />
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
          <button className="btn btn-ghost btn-xs">edit</button>
        </th>
        <th>
          <button className="btn btn-ghost btn-info btn-xs">duplicate</button>
        </th>
        <th>
          <button className="btn btn-ghost btn-error btn-xs">delete</button>
        </th>
      </tr>
    </tbody>
  );
};

export default BookRow;
