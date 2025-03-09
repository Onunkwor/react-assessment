import NotFound from "@/pages/404/NotFound";
import Dashboard from "@/pages/dashboard/Dashboard";
import EditMovie from "@/pages/edit-movie/EditMovie";
import Layout from "@/pages/layout/Layout";
import AddMovie from "@/pages/movies/AddMovie";
import Movies from "@/pages/movies/Movies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

export const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true, // This matches "/"
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/movies",
          element: <Movies />,
        },
        {
          path: "/add-movie",
          element: <AddMovie />,
        },
        {
          path: "/edit-movie/:id",
          element: <EditMovie />,
        },

        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
