import { createBrowserRouter, RouteObject } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import ErrorPage from '@/pages/ErrorPage'
import NotFoundPage from '@/pages/NotFoundPage'
import HomePage from '@/pages/HomePage'
import { Suspense, lazy } from 'react'
import { CardSkeleton } from '@/components/shared'

// Lazy-loaded routes for code-splitting
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const OrderTrackerPage = lazy(() => import('@/pages/OrderTrackerPage'))
const ShirtKanbanPage = lazy(() => import('@/pages/ShirtKanbanPage'))
const BusinessCardKanbanPage = lazy(() => import('@/pages/BusinessCardKanbanPage'))
const TaskManagerPage = lazy(() => import('@/pages/TaskManagerPage'))

/**
 * Wraps a component with Suspense and a fallback loading state
 */
const withSuspense = (Component: React.ComponentType, fallback: React.ReactNode = <CardSkeleton />) => {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  )
}

// Public routes accessible to all users
const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/signup',
    element: withSuspense(SignupPage),
  },
]

// Protected routes that require authentication
const protectedRoutes: RouteObject[] = [
  {
    path: '/orders',
    element: withSuspense(OrderTrackerPage),
  },
  {
    path: '/kanban/shirts',
    element: withSuspense(ShirtKanbanPage),
  },
  {
    path: '/kanban/business-cards',
    element: withSuspense(BusinessCardKanbanPage),
  },
  {
    path: '/tasks',
    element: withSuspense(TaskManagerPage),
  }
]

// Main application routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Include public and protected routes
      ...publicRoutes,
      ...protectedRoutes,
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

/**
 * Application router configuration
 */
export const router = createBrowserRouter(routes)

/**
 * Router configuration with auth protection
 * To be used when auth is implemented
 */
export const createAuthRouter = (isAuthenticated: boolean) => {
  // If authentication is implemented, this function can be updated
  // to conditionally include routes based on auth state
  return router
}