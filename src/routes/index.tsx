import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CreateBook from "../page/CreateBook";
import BookList from "../page/BookList";
import Register from "../page/Register";
import Login from "../page/Login";
import SaleHistory from "../page/SaleHistory";

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
      {
        path: "sale-history",
        element: <SaleHistory />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
