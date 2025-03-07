import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CreateBook from "../page/CreateBook";
import BookList from "../page/BookList";
import Register from "../page/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "create-book",
        element: <CreateBook />,
      },
      {
        path: "book-list",
        element: <BookList />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
