import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

/**
 * The top-level component that renders the RouterProvider,
 * which provides the routing context to the app.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
