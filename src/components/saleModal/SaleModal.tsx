import { FC } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type SaleFormData = {
  book: string;
  quantity: number;
  buyer: string;
  saleDate: Date | null;
};

type SaleModalProp = {
  id: string;
  name: string;
  quantity: number;
};

const SaleModal: FC<SaleModalProp> = ({ id, name, quantity }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SaleFormData>({
    defaultValues: {
      book: id,
      quantity: 1,
      buyer: "",
      saleDate: new Date(),
    },
  });

  const saleDate = watch("saleDate");

  const onSubmit = (data: SaleFormData) => {
    console.log("Form submitted:", data);
    reset();
    const modal = document.getElementById("sale_modal") as HTMLDialogElement;
    modal.close();
  };

  const handleDateChange = (date: Date | null) => {
    setValue("saleDate", date, { shouldValidate: true });
  };

  // Custom handler to clamp quantity input
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
    <dialog id="sale_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg mb-4">New Sale - {name}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Book ID */}
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

          {/* Quantity */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Quantity (Max: {quantity})</span>
            </label>
            <input
              type="number"
              min={1} // Browser-level min
              max={quantity} // Browser-level max
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
              onChange={handleQuantityChange} // Custom clamping
            />
            {errors.quantity && (
              <span className="text-error text-sm mt-1">
                {errors.quantity.message}
              </span>
            )}
          </div>

          {/* Buyer */}
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

          {/* Sale Date with React DatePicker */}
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

          {/* Modal Actions */}
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
  );
};

export default SaleModal;
