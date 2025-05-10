# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Compile TypeScript and build for production |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |

## Project Architecture

This is a React application built with TypeScript and Vite. The project uses a component-based architecture with the following structure:

### Key Technologies

- **React 19**: UI library
- **TypeScript**: For type safety
- **Vite**: Build tool and development server
- **TailwindCSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Shadcn UI**: Component collection based on Radix UI
- **Zustand**: Lightweight state management
- **React Router**: For navigation and routing
- **React Hook Form**: For form handling with validation
- **Zod**: For schema validation
- **React Query / TanStack Query**: For data fetching and cache management
- **Axios**: HTTP client for API requests
- **Sonner**: Toast notifications
- **Lucide React**: Icon library
- **Next-themes**: Theme management (light/dark mode)
- **Class Variance Authority (CVA)**: For component variants
- **Tailwind Merge & clsx**: For class name management
- **Vitest**: For testing with React Testing Library

### Directory Structure

- `/src`: Main source code
  - `/components`: UI components
    - `/ui`: Base UI components from shadcn/ui
    - `/shared`: Shared components used across features
    - `/order-tracker`: Order tracker specific components
    - `/shirt-kanban`: Shirt production kanban components
    - `/task-manager`: Task manager specific components
    - `/business-card-kanban`: Business card kanban components
  - `/pages`: Page components that correspond to routes
  - `/layouts`: Layout components that wrap pages
  - `/context`: Context providers for global state
  - `/store`: Zustand stores for state management
  - `/hooks`: Custom React hooks
  - `/types`: TypeScript type definitions and interfaces
  - `/utils`: Utility functions and helpers
  - `/services`: Service modules for data operations
  - `/lib`: Utility functions and shared code
  - `/assets`: Static assets like images
  - `/test`: Test utilities and setup

### State Management

The project uses Zustand for state management with stores for:
- Order tracking
- Shirt production kanban board
- Task management
- Business card kanban

Each store is typed with TypeScript and configured with persistence to localStorage.

### Component System

The project uses shadcn/ui component architecture, which:
- Implements components using Radix UI primitives
- Uses Tailwind CSS for styling
- Utilizes the class-variance-authority (cva) pattern for component variants
- Uses the cn() utility function (combining clsx and tailwind-merge) for class name management

### Path Aliases

The project uses path aliases for cleaner imports:
- `@/*` maps to `./src/*`
- `@/components/*` maps to `./src/components/*`
- `@/ui/*` maps to `./src/components/ui/*`
- `@/lib/*` maps to `./src/lib/*`
- `@/hooks/*` maps to `./src/hooks/*`
- `@/utils/*` maps to `./src/utils/*`
- `@/types/*` maps to `./src/types/*`
- `@/services/*` maps to `./src/services/*`
- `@/context/*` maps to `./src/context/*`
- `@/pages/*` maps to `./src/pages/*`
- `@/layouts/*` maps to `./src/layouts/*`
- `@/store/*` maps to `./src/store/*`

### Theme System

The project implements a theme system with:
- Light and dark mode support through next-themes
- Color variables defined in CSS custom properties
- Color scheme based on the OKLCH color space
- Themeable sidebar and chart colors

### Environment Configuration

The project uses environment variables for configuration:
- `.env`: Default environment variables for development
- `.env.production`: Production specific variables
- `.env.example`: Example variables for documentation
- Access via the `env.ts` utility for type-safe handling

## System Overview

The AZ Team Order Tracker consists of four interconnected components:

1. **Order Tracker**
   - Creates and manages orders with suppliers
   - Calculates production times and due dates
   - Tracks order status through standardized states

2. **Shirt Production Kanban Board**
   - Visualizes production workflow through 5 stages
   - Features drag-and-drop functionality
   - Tracks artwork status and prioritizes orders

3. **Task Manager**
   - Breaks down production into actionable tasks
   - Prioritizes tasks based on deadlines
   - Bidirectionally updates with the Kanban Board

4. **Business Card Kanban Board**
   - Tracks business card design and ordering process
   - Independent workflow with 4 sequential stages

### Data Flow

- **Order Tracker → Shirt Production Kanban Board**: One-way flow where new orders automatically appear in Kanban's first stage
- **Shirt Production Kanban Board ↔ Task Manager**: Bidirectional relationship where tasks completing in Task Manager can update Kanban status and vice versa
- **Business Card Kanban Board**: Independent workflow

## Implementation Status

The project foundation is complete with all necessary infrastructure:
- Project structure and configuration
- Routing setup with React Router and layout components
- State management with Zustand and React Context
- TypeScript models and utilities
- Testing infrastructure
- Base components and layouts
- Environment configuration

### Foundation Components

We've implemented several core infrastructure components:

1. **API Service Layer**
   - HTTP client with Axios and interceptors
   - Standardized error handling and error parsing
   - Request caching mechanism with configurable TTL
   - React Query integration for data fetching

2. **Error Handling Infrastructure**
   - Error boundary components to prevent app crashes
   - Error logging service for centralized error tracking
   - Standardized error types and formatting

3. **UI Component Infrastructure**
   - Loading state components with skeleton loaders
   - Toast notification system using Sonner
   - Modal and dialog components

4. **Form Handling System**
   - Integration with react-hook-form and zod validation
   - Form error components for field and form-level errors
   - Custom hooks for simplified form state management
   - Reusable form components with consistent styling

5. **Storage Utilities**
   - Enhanced localStorage service with versioning
   - Secure storage option for sensitive data
   - React hooks for reactive storage usage in components

The project follows the implementation roadmap in `/docs/implementation-roadmap.md`, which outlines the remaining phases:
1. Order Tracker Component (next phase)
2. Shirt Production Kanban Board
3. Task Manager Component
4. Business Card Kanban Board
5. Component Integration
6. User Experience Refinement
7. Data Persistence and Backend Integration
8. Testing and Quality Assurance
9. Deployment and Delivery
10. Post-Launch Activities

Reference this roadmap when implementing new features to ensure alignment with the overall project structure and timeline.