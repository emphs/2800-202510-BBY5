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
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import MapPage from './pages/MapPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';

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

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/map',
  component: MapPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  homeRoute,
  adminRoute,
  mapRoute,
  reportsRoute,
  profileRoute,
]);

// Create the router instance with browser history
const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
});

// Export the router and provider components
export { router };
