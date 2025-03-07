// App.tsx
import React from "react";
import CreateBookForm from "../components/createBook/CreateBookForm";

const CreateBook: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <CreateBookForm />
    </div>
  );
};

export default CreateBook;
