import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CreateBook from "../page/CreateBook";
import BookList from "../page/BookList";

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
]);

export default router;
