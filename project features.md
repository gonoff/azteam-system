# AZ Team Order Tracker - Feature Specification Document

## Problem Statement & Expected Outcomes

**Problem:** Managing custom apparel orders through multiple production processes creates challenges in tracking orders with suppliers, monitoring production status, and organizing production tasks efficiently. Without a unified system, teams struggle with prioritization, time management, and maintaining visibility across separate workflows.

**Expected Outcomes:**
- Streamlined supplier order management with accurate delivery time estimates
- Visual tracking of shirt production and business card design processes
- Organized task management with clear prioritization
- Reduced production delays and improved delivery time accuracy
- Better resource allocation through time-based planning

## System Components Overview

The AZ Team Order Tracker consists of four interconnected components:

1. **Order Tracker** → Creates and manages orders with suppliers and feeds into the Kanban Board
2. **Shirt Production Kanban Board** → Visualizes shirt production progress through stages
3. **Task Manager** → Organizes actionable production tasks for shirt customization
4. **Business Card Kanban Board** → Tracks business card design and ordering process

### Data Flow Between Components
- **Order Tracker** → **Shirt Production Kanban Board** (one-way flow: new orders automatically appear in Kanban's first stage)
- **Shirt Production Kanban Board** ↔ **Task Manager** → Bidirectional relationship where tasks completing in Task Manager can update Kanban status and vice versa
- **Business Card Kanban Board** → Independent workflow for business card production

## Primary Workflows

### 1. Supplier Order Management & Production Workflow
1. Create new order with client information in Order Tracker
2. Order automatically appears in first stage of Shirt Production Kanban Board
3. Update supplier order status in Order Tracker (AWAITING → ORDER_PLACED → SHIRTS_ARRIVED → DELIVERED)
4. Simultaneously track production progress by moving cards through Kanban stages
5. Complete related tasks in Task Manager as production proceeds

### 2. Task Execution Workflow
1. View prioritized tasks in Task Manager
2. Complete production tasks in sequence
3. Mark tasks as complete when finished
4. Completed tasks move to "Completed" section
5. Card progresses through Kanban Board as related tasks are completed

### 3. Business Card Workflow
1. Create card in Business Card Kanban Board when order is received
2. Progress through art creation, approval, and ordering stages
3. Move cards between stages as work is completed

## 1. Order Tracker Features

### Primary Purpose
Create and manage custom shirt orders with suppliers, generate automated time estimates, and feed orders into the production tracking system.

### Key Features

#### Order Information
- Client identification (name + last 4 digits of phone, minimum 4 characters)
- Order date (automatically captured)
- Priority flag (optional toggle)
- Items (multiple per order)
- Due date (auto-calculated or manually set)

#### Item Details
- Size selection (XS, S, M, L, XL, XXL, XXXL)
- Quantity
- Description/specifications
- Production method (Heat Transfer Vinyl, Sublimation, Embroidery)
- Status tracking with standardized states:
  - AWAITING (AGUARDANDO)
  - ORDER_PLACED (PEDIDO_FEITO)
  - SHIRTS_ARRIVED (BLUSAS_CHEGARAM)
  - DELIVERED (ENTREGUE)

#### Production Time Calculation
- Configurable time estimates for each production stage:
  - Heat Transfer Vinyl: Cut Vinyl (5 min/unit), Weed Vinyl (3 min/unit), Press Shirts (2 min/unit)
  - Sublimation: Print design (1 min/unit), Press (2 min/unit)
  - Embroidery: Digitize (15 min/unit), Production (30 min/unit)
- Automatic calculation of time per item: Sum of (stage time × quantity)
- Automatic calculation of total time per order: Sum of all item times
- Refresh button to recalculate time estimates

#### Due Date Calculation
- Configurable production timeframes based on order size:
  - 1-10 shirts: 5 business days (excluding weekends)
  - 10-50 shirts: 10 business days (excluding weekends)
  - Additional tiers as needed
- Automatic due date generation based on order date plus calculated timeframe

#### Order Management
- Create and edit orders (modify client info, add/remove items)
- Filter orders by client name, date, or status
- In-line status updates without reopening order form
- Priority flagging for urgent orders
- Expandable/collapsible order details with toggle for compact view
- Automatic creation of corresponding card in Kanban Board's first stage when order is created

## 2. Shirt Production Kanban Board Features

### Primary Purpose
Visualize and track shirt production progress through manufacturing stages.

### Key Features

#### Board Structure
- **5 Sequential Production Stages**:
  1. New Order
  2. Order Placed
  3. Shirts Arriving
  4. Materials Ready
  5. Uniform Completed
- Drag-and-drop functionality for moving orders between stages

#### Order Cards
- Client name and identifier
- Order date and calculated due date
- Production method(s)
- Size(s) and quantities
- Priority indicator
- Description/specifications
- Artwork status indicator
- Visual cues for approaching/past due dates
- Automatic creation from Order Tracker entries

#### Artwork Status Tracking
- Three-state tracking:
  1. Needs Creation
  2. Awaiting Approval
  3. Approved
- Visual indicators for each state

#### Filtering & Sorting Capabilities
- Filter by production method (Heat Transfer Vinyl, Sublimation, Embroidery)
- Filter by priority status
- Sort by date (ascending/descending)
- Sort by client name (alphabetical)
- Sort by due date (approaching first)

#### Status Management
- Update production stage via drag-and-drop
- Update artwork status directly from card
- Status changes can trigger updates in Task Manager

## 3. Task Manager Features

### Primary Purpose
Break down shirt production orders into actionable production tasks with time tracking.

### Key Features

#### Automated Task Generation
- System-generated tasks based on production method:
  - Heat Transfer Vinyl: Cut Vinyl, Weed Vinyl, Press Shirts
  - Sublimation: Print Design, Press
  - Embroidery: Digitize, Production
- Inherited time estimates from Order Tracker calculations
- Tasks can be linked to specific Kanban cards

#### Task Detail Display
- Client name and order reference
- Item specifications (method, size, quantity)
- Task-specific instructions/requirements
- Estimated completion time
- Task completion controls
- Reference to associated Kanban card

#### Task Organization System
- Automatic sorting by priority and deadline (from most to least urgent)
- Optional grouping by production method
- Two-tab system: "Pending Tasks" and "Completed Tasks"
- Search and filter capabilities for both pending and completed tasks

#### Task-Kanban Integration
- Completing all tasks for a production stage can automatically move the Kanban card forward
- Moving a Kanban card to a new stage can mark associated tasks as complete
- Option to view tasks filtered by Kanban card or production stage

#### Task Completion Workflow
1. View prioritized pending tasks
2. Select and complete tasks
3. Mark tasks as complete
4. Task moves to "Completed" tab
5. Associated Kanban card updates (optional)
6. Ability to reactivate completed tasks if needed

## 4. Business Card Kanban Board Features

### Primary Purpose
Track business card orders through design, approval, and ordering process.

### Key Features

#### Board Structure
- **4 Sequential Stages**:
  1. Art Needs to be Done
  2. Waiting for Approval
  3. Approved
  4. Ordered Online
- Drag-and-drop functionality for moving cards between stages

#### Card Information
- Client name and contact information
- Order date
- Design specifications
- Quantity ordered
- Priority indicator
- Due date
- Notes/comments section

#### Card Management
- Create new business card orders
- Move cards between stages as progress is made
- Update design requirements directly from card
- Upload design files or mockups to cards
- Track supplier order information in final stage

#### Filtering & Organization
- Filter by client name
- Sort by date (oldest/newest)
- Sort by priority
- Search by keyword

## Future Enhancements

The following features are planned for future implementation but are not included in the current scope:

- Client Registry and CRM functionality
- Team Member Registry with role-based permissions
- Product Registry with customizable variables
- Financial Tracking for deposits and payments