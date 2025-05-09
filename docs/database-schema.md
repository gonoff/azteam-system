# Database Schema

## Entity Relationship Diagram

```
┌────────────────┐       ┌────────────────┐       ┌────────────────┐
│     Order      │       │     Item       │       │     Task       │
├────────────────┤       ├────────────────┤       ├────────────────┤
│ id             │       │ id             │       │ id             │
│ clientName     │1    *│ orderId         │1    *│ itemId         │
│ clientPhone    ├───────┤ size           ├───────┤ type           │
│ orderDate      │       │ quantity       │       │ description    │
│ dueDate        │       │ description    │       │ estimatedTime  │
│ priority       │       │ productionMethod│       │ status        │
│ status         │       │ status         │       │ completedAt    │
└────────────────┘       └────────────────┘       └────────────────┘
        │                                                 
        │                                                 
        │1                                               
        │                                                
        ▼                                                
┌────────────────┐       ┌────────────────┐              
│  KanbanCard    │       │ BusinessCard   │              
├────────────────┤       ├────────────────┤              
│ id             │       │ id             │              
│ orderId        │       │ clientName     │              
│ stage          │       │ clientPhone    │              
│ artworkStatus  │       │ orderDate      │              
└────────────────┘       │ dueDate        │              
                         │ description    │              
                         │ quantity       │              
                         │ stage          │              
                         │ priority       │              
                         │ notes          │              
                         └────────────────┘              
```

## Entity Definitions

### Order

Store information about customer shirt orders.

| Field | Type | Description |
|-------|------|-------------|
| id | String/UUID | Primary identifier |
| clientName | String | Customer name (required, min 4 chars) |
| clientPhone | String | Last 4 digits of phone number |
| orderDate | Date | When the order was created (auto) |
| dueDate | Date | Calculated or manually set delivery date |
| priority | Boolean | Flag for high priority orders |
| status | Enum | Current order status |

**Status Values:**
- AWAITING
- ORDER_PLACED
- SHIRTS_ARRIVED
- DELIVERED

### Item

Individual items within an order.

| Field | Type | Description |
|-------|------|-------------|
| id | String/UUID | Primary identifier |
| orderId | String/UUID | Reference to parent order |
| size | Enum | Shirt size |
| quantity | Number | How many of this item |
| description | String | Item specifications |
| productionMethod | Enum | Manufacturing technique |
| status | Enum | Current item status |

**Size Values:**
- XS, S, M, L, XL, XXL, XXXL

**Production Method Values:**
- HEAT_TRANSFER_VINYL
- SUBLIMATION
- EMBROIDERY

### KanbanCard

Visual representation of orders in the production process.

| Field | Type | Description |
|-------|------|-------------|
| id | String/UUID | Primary identifier |
| orderId | String/UUID | Reference to related order |
| stage | Enum | Current production stage |
| artworkStatus | Enum | Current artwork status |

**Stage Values:**
- NEW_ORDER
- ORDER_PLACED
- SHIRTS_ARRIVING
- MATERIALS_READY
- UNIFORM_COMPLETED

**Artwork Status Values:**
- NEEDS_CREATION
- AWAITING_APPROVAL
- APPROVED

### Task

Production tasks related to items.

| Field | Type | Description |
|-------|------|-------------|
| id | String/UUID | Primary identifier |
| itemId | String/UUID | Reference to related item |
| type | Enum | Type of task |
| description | String | Task details |
| estimatedTime | Number | Minutes required (calculated) |
| status | Enum | Task completion status |
| completedAt | Date | When task was completed |

**Task Type Values (by production method):**
- **Heat Transfer Vinyl**: CUT_VINYL, WEED_VINYL, PRESS_SHIRTS
- **Sublimation**: PRINT_DESIGN, PRESS
- **Embroidery**: DIGITIZE, PRODUCTION

**Status Values:**
- PENDING
- COMPLETED

### BusinessCard

Track business card design and ordering process.

| Field | Type | Description |
|-------|------|-------------|
| id | String/UUID | Primary identifier |
| clientName | String | Customer name |
| clientPhone | String | Customer contact information |
| orderDate | Date | When card was ordered |
| dueDate | Date | Expected delivery date |
| description | String | Design specifications |
| quantity | Number | Number of cards ordered |
| stage | Enum | Current process stage |
| priority | Boolean | High priority flag |
| notes | String | Additional information |

**Stage Values:**
- ART_NEEDS_DONE
- WAITING_APPROVAL
- APPROVED
- ORDERED_ONLINE

## Relationships

1. **Order to Item**: One-to-many relationship. An order contains multiple items.
2. **Order to KanbanCard**: One-to-one relationship. Each order has one representation on the Kanban board.
3. **Item to Task**: One-to-many relationship. Each item generates multiple production tasks based on production method.

## Derived Data & Calculations

1. **Production Time Calculation**
   - Heat Transfer Vinyl: (5 min × qty) + (3 min × qty) + (2 min × qty)
   - Sublimation: (1 min × qty) + (2 min × qty)
   - Embroidery: (15 min × qty) + (30 min × qty)

2. **Due Date Calculation**
   - 1-10 shirts: Order date + 5 business days
   - 10-50 shirts: Order date + 10 business days

## Indexes

- Orders: clientName, orderDate, status, dueDate
- Items: orderId, productionMethod
- Tasks: itemId, status
- KanbanCard: stage, orderId
- BusinessCard: stage, clientName, dueDate