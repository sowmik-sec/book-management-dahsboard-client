import { FC } from "react";
import { useDeleteSingleBookMutation } from "../../redux/features/book/bookApi";
import { toggleBookId } from "../../redux/features/book/bookSlice";
import { useAppDispatch } from "../../redux/hook";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateSaleMutation } from "../../redux/features/sale/saleApi";

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

type SaleFormData = {
  book: string;
  quantity: number;
  buyer: string;
  saleDate: Date | null;
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
  const [createSale] = useCreateSaleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SaleFormData>({
    defaultValues: {
      book: _id,
      quantity: 1,
      buyer: "",
      saleDate: new Date(),
    },
  });

  const saleDate = watch("saleDate");

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

  const onSubmit = async (data: SaleFormData) => {
    console.log("Form submitted:", data);
    const res = await createSale(data).unwrap();
    console.log(res);
    if (res?.success) {
      reset();
      const modal = document.getElementById(
        `sale_modal_${_id}`
      ) as HTMLDialogElement;
      modal.close();
    }
  };

  const handleDateChange = (date: Date | null) => {
    setValue("saleDate", date, { shouldValidate: true });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setValue("quantity", 1, { shouldValidate: true });
    } else if (value > quantity) {
      setValue("quantity", quantity, { shouldValidate: true });
    } else {
      setValue("quantity", value, { shouldValidate: true });
    }
  };

  return (
    <>
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
              const modal = document.getElementById(
                `sale_modal_${_id}`
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

      {/* Modal specific to this book */}
      <dialog
        id={`sale_modal_${_id}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg mb-4">New Sale - {name}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Book ID</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full text-black bg-white border-purple-400 ${
                  errors.book ? "border-error" : ""
                }`}
                {...register("book", { required: "Book ID is required" })}
                disabled
              />
              {errors.book && (
                <span className="text-error text-sm mt-1">
                  {errors.book.message}
                </span>
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Quantity (Max: {quantity})</span>
              </label>
              <input
                type="number"
                min={1}
                max={quantity}
                className={`input input-bordered w-full text-black bg-white border-purple-400 ${
                  errors.quantity ? "border-error" : ""
                }`}
                {...register("quantity", {
                  required: "Quantity is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Quantity must be at least 1" },
                  max: {
                    value: quantity,
                    message: `Quantity cannot exceed ${quantity}`,
                  },
                })}
                onChange={handleQuantityChange}
              />
              {errors.quantity && (
                <span className="text-error text-sm mt-1">
                  {errors.quantity.message}
                </span>
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Buyer Name</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full text-black bg-white border-purple-400 ${
                  errors.buyer ? "border-error" : ""
                }`}
                {...register("buyer", { required: "Buyer name is required" })}
              />
              {errors.buyer && (
                <span className="text-error text-sm mt-1">
                  {errors.buyer.message}
                </span>
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Sale Date</span>
              </label>
              <DatePicker
                selected={saleDate}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="Pp"
                className={`input input-bordered w-full text-black bg-white border-purple-400 ${
                  errors.saleDate ? "border-error" : ""
                }`}
              />
              {errors.saleDate && (
                <span className="text-error text-sm mt-1">
                  {errors.saleDate.message}
                </span>
              )}
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <form method="dialog">
                <button className="btn btn-ghost">Close</button>
              </form>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default BookRow;
