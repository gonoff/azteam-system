# System Architecture

## Overview

The AZ Team Order Tracker is built with a component-based architecture using React, TypeScript, and modern state management patterns. The system is structured around four primary functional components that interact to provide a complete order and production management solution.

## Core Components

```
┌─────────────────┐            ┌───────────────────────┐
│                 │            │                       │
│  Order Tracker  │───────────▶│ Shirt Production      │
│                 │            │ Kanban Board          │
└─────────────────┘            │                       │
                               └───────────┬───────────┘
                                           │
                                           │ Bidirectional
                                           │ Integration
                                           │
                                           ▼
┌─────────────────┐            ┌───────────────────────┐
│                 │            │                       │
│  Business Card  │            │ Task Manager          │
│  Kanban Board   │            │                       │
│                 │            │                       │
└─────────────────┘            └───────────────────────┘
```

### Component Responsibilities

1. **Order Tracker**
   - Order creation and management
   - Production time estimation
   - Due date calculation
   - Status tracking

2. **Shirt Production Kanban Board**
   - Visual workflow management
   - Production stage tracking
   - Artwork status monitoring
   - Order prioritization

3. **Task Manager**
   - Task breakdown and organization
   - Production task prioritization
   - Time tracking
   - Task completion workflow

4. **Business Card Kanban Board**
   - Design workflow tracking
   - Approval process management
   - Order fulfillment tracking

## Data Flow

### One-Way Data Flow
- Order creation in the Order Tracker automatically generates a new card in the Shirt Production Kanban Board's first stage.

### Bidirectional Data Flow
- Task completion in the Task Manager can update the status of cards in the Shirt Production Kanban Board.
- Moving cards between stages in the Kanban Board can mark associated tasks as complete in the Task Manager.

### Independent Workflows
- The Business Card Kanban Board operates as an independent workflow system without direct integration with other components.

## Technology Stack

### Frontend
- **React 19**: UI library
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library based on Radix UI

### State Management
- Local component state for UI-specific state
- Global state management for shared application state
- Persistence layer for data storage

### Build & Development
- **Vite**: Fast build tool and development server
- **ESLint**: Code quality and consistency

## Data Models

The system uses the following core data models:

1. **Order**: Contains client information, items, dates, and status
2. **Item**: Individual products within an order with production details
3. **KanbanCard**: Visual representation of orders in production stages
4. **Task**: Actionable production work items
5. **BusinessCard**: Tracking for business card design and production

## Integration Points

### Order Tracker → Kanban Board
- New orders trigger automatic card creation
- Status updates may sync between systems

### Kanban Board ↔ Task Manager
- Cards moving to new stages can update task status
- Completed tasks can automatically progress cards

## Future Architecture Considerations

The architecture is designed to accommodate future enhancements:
- Client/Team Member registries
- Product catalog
- Financial tracking
- Authentication and authorization