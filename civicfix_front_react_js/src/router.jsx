import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { createBrowserHistory } from '@tanstack/react-router';

// Import your pages
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';

// Create a root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="app-container">
      {/* Add any common layout components here (header, navigation, etc.) */}
      <Outlet /> {/* This renders the matched child route */}
    </div>
  ),
});

// Create individual routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute, // Changed to rootRoute for direct access
  path: '/login',
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute, // Changed to rootRoute for direct access
  path: '/signup',
  component: SignupPage,
});

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/main',
  component: MainPage,
});

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  mainRoute,
]);

// Create the router instance with browser history
const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
});

// Export the router and provider components
export { router };
