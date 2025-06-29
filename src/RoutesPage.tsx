import { createBrowserRouter } from "react-router";
import Homepage from "./pages/Homepage";
import Layout from "./Layout";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Homepage,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);
