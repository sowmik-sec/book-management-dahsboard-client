export enum BookFormat {
  Hardcover = "hardcover",
  Paperback = "paperback",
  Ebook = "e-book",
  Audiobook = "audiobook",
}
// components/CreateBookForm.tsx
import React from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema (unchanged)
const bookSchema = z.object({
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

type BookFormData = z.infer<typeof bookSchema>;

const CreateBookForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
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

  const onSubmit: SubmitHandler<BookFormData> = async (data) => {
    try {
      const cleanedData = {
        ...data,
        genres: data.genres.filter((g) => !g.isDeleted),
        releaseDate: data.releaseDate,
      };
      console.log("Book created:", cleanedData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
    } catch (error) {
      console.error("Book creation failed:", error);
      alert("Failed to create book. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
        Create New Book
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {/* Name */}
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
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
            placeholder="The Great Gatsby"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

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
            <p className="mt-1 text-sm text-red-500">{errors.author.message}</p>
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
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
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
            <p className="mt-1 text-sm text-red-500">{errors.series.message}</p>
          )}
        </div>

        {/* Genres (Dynamic Array) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genres
          </label>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2"
            >
              <input
                {...register(`genres.${index}.genre`)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
                placeholder="Fiction"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="w-full sm:w-auto px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ genre: "", isDeleted: false })}
            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Add Genre
          </button>
          {errors.genres && (
            <p className="mt-1 text-sm text-red-500">{errors.genres.message}</p>
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
            <p className="mt-1 text-sm text-red-500">{errors.format.message}</p>
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            "Create Book"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateBookForm;
