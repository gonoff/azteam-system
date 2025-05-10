import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { MainLayout } from '@/layouts'
import {
  HomePage,
  OrderTrackerPage,
  ShirtKanbanPage,
  TaskManagerPage,
  BusinessCardKanbanPage,
  NotFoundPage
} from '@/pages'

// Define all application routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'orders',
        element: <OrderTrackerPage />,
      },
      {
        path: 'shirt-kanban',
        element: <ShirtKanbanPage />,
      },
      {
        path: 'tasks',
        element: <TaskManagerPage />,
      },
      {
        path: 'business-cards',
        element: <BusinessCardKanbanPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

// Create and export the router configuration
export const router = createBrowserRouter(routes)