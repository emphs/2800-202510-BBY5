import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createRouter,
    RouterProvider,
    createRoute,
    createRootRoute
} from '@tanstack/react-router';
import App from './App.jsx';
import MainPage from './pages/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import IndexPage from './pages/IndexPage.jsx';

const rootRoute = createRootRoute({
  component: App
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LoginPage
});

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'main',
  component: MainPage
});

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, loginRoute, mainRoute])
});

const root = createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
