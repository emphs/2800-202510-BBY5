import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createRouter,
    RouterProvider,
    createRoute,
    createRootRoute
} from '@tanstack/react-router';
import './index.css';
import App from './App.jsx';
import HomePage from './HomePage.jsx';
import LoginPage from './Login.jsx';
import IndexPage from './IndexPage.jsx';

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

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'home',
  component: HomePage
});

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, loginRoute, homeRoute])
});

const root = createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
