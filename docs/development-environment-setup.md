# Development Environment Setup

This document outlines the steps required to set up a development environment for the AZ Team Order Tracker project.

## Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/azteam-system.git
cd azteam-system/azteam
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
VITE_APP_TITLE="AZ Team Order Tracker"
VITE_APP_TIME_ESTIMATE_CONFIG="true"
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot module replacement |
| `npm run build` | Build the application for production |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
azteam/
├── public/               # Static public assets
├── src/                  # Source code
│   ├── assets/           # Static assets (images, fonts)
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── order-tracker/   # Order Tracker components
│   │   ├── kanban/       # Kanban Board components
│   │   ├── task-manager/ # Task Manager components
│   │   └── business-card/# Business Card components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and helpers
│   ├── providers/        # Context providers
│   ├── store/            # State management
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Application entry point
├── index.html            # HTML template
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Project dependencies and scripts
```

## Code Style and Conventions

### TypeScript

- Use TypeScript for all new code
- Always define proper interfaces and types
- Avoid using `any` type
- Use type inference where possible

### Component Structure

```typescript
// ComponentName.tsx
import React from 'react';
import { cn } from '@/lib/utils';

// Define types/interfaces
interface ComponentNameProps {
  // props...
}

// Define component
export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // component logic...
  
  return (
    // JSX...
  );
}
```

### State Management

- Use local component state for UI-specific state
- Use React Context API for shared state between components
- Consider using custom hooks to encapsulate complex state logic
- Follow a clear state update pattern:
  - Define actions
  - Create pure reducer functions
  - Connect components via context providers

## User Interface Components

This project uses shadcn/ui components based on Radix UI primitives. These components provide accessible, customizable UI elements.

### Key UI Components

- **Button**: Primary interaction component
- **Dialog**: Modal dialogs for forms and confirmations
- **Form**: Form components for data entry
- **Card**: Container for information display
- **Tabs**: Organize content into selectable tabs
- **Select**: Dropdown selection component
- **Accordion**: Collapsible content panels

### Usage Example

```typescript
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function OrderCreateButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Order</DialogTitle>
        </DialogHeader>
        {/* Form content */}
      </DialogContent>
    </Dialog>
  );
}
```

## Browser Support

The application is designed to work on modern browsers:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` directory with the production build.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## Troubleshooting

### Common Issues

**Issue**: Node module resolution errors
**Solution**: Clear npm cache and reinstall dependencies
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

**Issue**: TypeScript compilation errors
**Solution**: Check `tsconfig.json` settings and ensure types are correctly defined

**Issue**: Styling issues
**Solution**: Verify that Tailwind CSS is properly configured and classes are correctly applied