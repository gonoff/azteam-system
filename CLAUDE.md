# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Compile TypeScript and build for production |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview the production build locally |

## Project Architecture

This is a React application built with TypeScript and Vite. The project uses a component-based architecture with the following structure:

### Key Technologies

- **React 19**: UI library
- **TypeScript**: For type safety
- **Vite**: Build tool and development server
- **TailwindCSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Shadcn UI**: Component collection based on Radix UI (as seen in components.json)

### Directory Structure

- `/src`: Main source code
  - `/components/ui`: Reusable UI components based on shadcn/ui
  - `/lib`: Utility functions and shared code
  - `/assets`: Static assets like images

### Component System

The project uses shadcn/ui component architecture, which:
- Implements components using Radix UI primitives
- Uses Tailwind CSS for styling
- Utilizes the class-variance-authority (cva) pattern for component variants
- Uses the cn() utility function (combining clsx and tailwind-merge) for class name management

### Path Aliases

The project uses path aliases for cleaner imports:
- `@/*` maps to `./src/*`

### Theme System

The project implements a theme system with:
- Light and dark mode support
- Color variables defined in CSS custom properties
- Color scheme based on the OKLCH color space