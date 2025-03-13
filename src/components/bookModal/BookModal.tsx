// components/BookModal.tsx
import React, { useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateBookMutation,
  useUpdateSingleBookMutation,
} from "../../redux/features/book/bookApi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { BookData, BookFormat } from "../bookRow/BookRow";
const bookSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Book name is required"),
  author: z.string().min(1, "Author name is required"),
  price: z.number().min(0, "Price must be ≥ 0"),
  releaseDate: z.string().min(1, "Release date is required"),
  publisher: z.string().min(1, "Publisher is required"),
  isbn: z.string(),
  language: z.string().min(1, "Language is required"),
  series: z.string().optional(),
  genres: z
    .array(
      z.object({
        genre: z.string().min(0, "Genre can be empty"),
        isDeleted: z.boolean().default(false),
      })
    )
    .nonempty("At least one genre is required"),
  format: z.nativeEnum(BookFormat, {
    errorMap: () => ({ message: "Invalid format" }),
  }),
  pageCount: z.number().int().min(1, "Minimum 1 page required"),
  quantity: z.number().int().min(1, "Quantity cannot be negative"),
});

export type BookFormData = z.infer<typeof bookSchema>;
interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: BookData | null; // Existing book data for edit/duplicate
  mode: "create" | "edit" | "duplicate";
}

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  book,
  mode,
}) => {
  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateSingleBookMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      name: "",
      author: "",
      price: 0,
      releaseDate: new Date().toISOString().split("T")[0],
      publisher: "",
      isbn: "",
      language: "",
      series: "",
      genres: [{ genre: "", isDeleted: false }],
      format: BookFormat.Paperback,
      pageCount: 1,
      quantity: 1,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "genres",
  });

  // Load book data when modal opens or book changes
  useEffect(() => {
    if (book && (mode === "edit" || mode === "duplicate")) {
      reset(book);
    }
    if (mode === "create") {
      reset();
    }
  }, [book, mode, reset]);

  const onSubmit: SubmitHandler<BookFormData> = async (data) => {
    try {
      const bookData = {
        ...data,
        genres: data.genres.filter((g) => !g.isDeleted),
        releaseDate: data.releaseDate,
      };
      const { _id, ...cleanedData } = bookData;

      console.log(_id);
      if (mode === "edit" && book?._id) {
        const payload = { id: book._id, ...cleanedData };
        const res = await updateBook(payload).unwrap();
        if (res.success) {
          alert("Book updated successfully");
        } else {
          console.log(`Can't update book`);
        }
      } else {
        const res = await createBook(cleanedData).unwrap();
        if (res.success) {
          alert(
            mode === "duplicate"
              ? "Book duplicated successfully"
              : "Book created successfully"
          );
        }
      }
      onClose();
      navigate("/book-list");
    } catch (error) {
      console.error(`${mode} failed:`, error);
      alert(`Failed to ${mode} book. Please try again.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "edit"
              ? "Edit Book"
              : mode === "duplicate"
              ? "Duplicate Book"
              : "Create New Book"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields - same as CreateBookForm but without the outer container styling */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Book Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Add other form fields here - copy from CreateBookForm */}
          {/* Author */}
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Author
            </label>
            <input
              id="author"
              type="text"
              {...register("author")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="F. Scott Fitzgerald"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-500">
                {errors.author.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="9.99"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Release Date */}
          <div>
            <label
              htmlFor="releaseDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Release Date
            </label>
            <input
              id="releaseDate"
              type="date"
              {...register("releaseDate")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
            />
            {errors.releaseDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.releaseDate.message}
              </p>
            )}
          </div>

          {/* Publisher */}
          <div>
            <label
              htmlFor="publisher"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Publisher
            </label>
            <input
              id="publisher"
              type="text"
              {...register("publisher")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="Scribner"
            />
            {errors.publisher && (
              <p className="mt-1 text-sm text-red-500">
                {errors.publisher.message}
              </p>
            )}
          </div>

          {/* ISBN */}
          <div>
            <label
              htmlFor="isbn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ISBN
            </label>
            <input
              id="isbn"
              type="text"
              {...register("isbn")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="978-0743273565"
            />
            {errors.isbn && (
              <p className="mt-1 text-sm text-red-500">{errors.isbn.message}</p>
            )}
          </div>

          {/* Language */}
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Language
            </label>
            <input
              id="language"
              type="text"
              {...register("language")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="English"
            />
            {errors.language && (
              <p className="mt-1 text-sm text-red-500">
                {errors.language.message}
              </p>
            )}
          </div>

          {/* Series (Optional) */}
          <div>
            <label
              htmlFor="series"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Series (Optional)
            </label>
            <input
              id="series"
              type="text"
              {...register("series")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="The Chronicles"
            />
            {errors.series && (
              <p className="mt-1 text-sm text-red-500">
                {errors.series.message}
              </p>
            )}
          </div>
          {/* For brevity, I'm showing only one field, but you should include all fields */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genres
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <input
                  {...register(`genres.${index}.genre`)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ genre: "", isDeleted: false })}
              className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Add Genre
            </button>
            {errors.genres && (
              <p className="mt-1 text-sm text-red-500">
                {errors.genres.message}
              </p>
            )}
          </div>
          {/* Format */}
          <div>
            <label
              htmlFor="format"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Format
            </label>
            <select
              id="format"
              {...register("format")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
            >
              {Object.values(BookFormat).map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
            {errors.format && (
              <p className="mt-1 text-sm text-red-500">
                {errors.format.message}
              </p>
            )}
          </div>

          {/* Page Count */}
          <div>
            <label
              htmlFor="pageCount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Page Count
            </label>
            <input
              id="pageCount"
              type="number"
              {...register("pageCount", { valueAsNumber: true })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="300"
            />
            {errors.pageCount && (
              <p className="mt-1 text-sm text-red-500">
                {errors.pageCount.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="1"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
