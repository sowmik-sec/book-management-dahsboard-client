// components/RegistrationForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

// Schema (unchanged)
const registrationSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string(),
  name: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  }),
  contactNo: z.string().min(1, "Contact number is required"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      name: { firstName: "", lastName: "" },
      contactNo: "",
    },
  });

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
        Create Account
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {/* Email Field */}
        <div className="relative">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register("name.firstName")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="John"
            />
            {errors.name?.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.firstName.message}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register("name.lastName")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="Doe"
            />
            {errors.name?.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Contact Number Field */}
        <div className="relative">
          <label
            htmlFor="contactNo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Number
          </label>
          <input
            id="contactNo"
            type="tel"
            {...register("contactNo")}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
            placeholder="1234567890"
          />
          {errors.contactNo && (
            <p className="mt-1 text-sm text-red-500">
              {errors.contactNo.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
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
              Registering...
            </span>
          ) : (
            "Register Now"
          )}
        </button>

        {/* Sign In Link */}
        <div className="mt-4 text-center text-sm sm:text-base">
          <p>
            Already have an account?{" "}
            <Link
              className="text-purple-600 hover:text-purple-800 transition-colors"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
