# Component API Specifications

This document defines the interface specifications and interaction patterns between the major components of the AZ Team Order Tracker system.

## 1. Order Tracker Component API

### State Interface

```typescript
interface OrderTrackerState {
  orders: Order[];
  currentOrder: Order | null;
  isEditing: boolean;
  filter: {
    client: string;
    status: OrderStatus | null;
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
  };
}

interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  orderDate: Date;
  dueDate: Date;
  priority: boolean;
  status: OrderStatus;
  items: Item[];
  totalEstimatedTime: number; // In minutes
}

interface Item {
  id: string;
  size: ItemSize;
  quantity: number;
  description: string;
  productionMethod: ProductionMethod;
  status: OrderStatus;
  estimatedTime: number; // In minutes
}

enum OrderStatus {
  AWAITING = 'AWAITING',
  ORDER_PLACED = 'ORDER_PLACED',
  SHIRTS_ARRIVED = 'SHIRTS_ARRIVED',
  DELIVERED = 'DELIVERED'
}

enum ItemSize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL'
}

enum ProductionMethod {
  HEAT_TRANSFER_VINYL = 'HEAT_TRANSFER_VINYL',
  SUBLIMATION = 'SUBLIMATION',
  EMBROIDERY = 'EMBROIDERY'
}
```

### Public Methods

```typescript
interface OrderTrackerAPI {
  // CRUD Operations
  createOrder(order: Omit<Order, 'id' | 'orderDate' | 'totalEstimatedTime'>): Order;
  getOrder(id: string): Order | undefined;
  updateOrder(id: string, updates: Partial<Order>): Order;
  deleteOrder(id: string): boolean;
  
  // Item Management
  addItem(orderId: string, item: Omit<Item, 'id' | 'estimatedTime'>): Item;
  updateItem(orderId: string, itemId: string, updates: Partial<Item>): Item;
  removeItem(orderId: string, itemId: string): boolean;
  
  // Status Management
  updateOrderStatus(orderId: string, status: OrderStatus): Order;
  updateItemStatus(orderId: string, itemId: string, status: OrderStatus): Item;
  
  // Calculations
  calculateItemTime(item: Item): number;
  calculateOrderTime(order: Order): number;
  calculateDueDate(order: Order): Date;
  
  // Filtering
  filterOrders(filter: OrderTrackerState['filter']): Order[];
}
```

### Events

```typescript
interface OrderTrackerEvents {
  onOrderCreated: (order: Order) => void;
  onOrderUpdated: (order: Order) => void;
  onOrderDeleted: (orderId: string) => void;
  onOrderStatusChanged: (order: Order, previousStatus: OrderStatus) => void;
}
```

## 2. Shirt Production Kanban Board Component API

### State Interface

```typescript
interface KanbanBoardState {
  stages: KanbanStage[];
  cards: KanbanCard[];
  filter: {
    productionMethod: ProductionMethod | null;
    priority: boolean | null;
    search: string;
  };
  sort: {
    by: 'date' | 'clientName' | 'dueDate';
    order: 'asc' | 'desc';
  };
}

interface KanbanStage {
  id: KanbanStageType;
  name: string;
}

interface KanbanCard {
  id: string;
  orderId: string;
  clientName: string;
  orderDate: Date;
  dueDate: Date;
  priority: boolean;
  stage: KanbanStageType;
  artworkStatus: ArtworkStatus;
  items: {
    size: ItemSize;
    quantity: number;
    productionMethod: ProductionMethod;
  }[];
  description: string;
}

enum KanbanStageType {
  NEW_ORDER = 'NEW_ORDER',
  ORDER_PLACED = 'ORDER_PLACED',
  SHIRTS_ARRIVING = 'SHIRTS_ARRIVING',
  MATERIALS_READY = 'MATERIALS_READY',
  UNIFORM_COMPLETED = 'UNIFORM_COMPLETED'
}

enum ArtworkStatus {
  NEEDS_CREATION = 'NEEDS_CREATION',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  APPROVED = 'APPROVED'
}
```

### Public Methods

```typescript
interface KanbanBoardAPI {
  // Card Management
  createCard(order: Order): KanbanCard;
  updateCard(id: string, updates: Partial<KanbanCard>): KanbanCard;
  deleteCard(id: string): boolean;
  
  // Stage Management
  moveCard(cardId: string, targetStage: KanbanStageType): KanbanCard;
  
  // Artwork Management
  updateArtworkStatus(cardId: string, status: ArtworkStatus): KanbanCard;
  
  // Filtering & Sorting
  filterCards(filter: KanbanBoardState['filter']): KanbanCard[];
  sortCards(sort: KanbanBoardState['sort']): KanbanCard[];
  
  // Card Lookup
  getCardByOrderId(orderId: string): KanbanCard | undefined;
}
```

### Events

```typescript
interface KanbanBoardEvents {
  onCardCreated: (card: KanbanCard) => void;
  onCardMoved: (card: KanbanCard, previousStage: KanbanStageType) => void;
  onArtworkStatusChanged: (card: KanbanCard, previousStatus: ArtworkStatus) => void;
}
```

## 3. Task Manager Component API

### State Interface

```typescript
interface TaskManagerState {
  pendingTasks: Task[];
  completedTasks: Task[];
  filter: {
    productionMethod: ProductionMethod | null;
    search: string;
    orderId: string | null;
  };
  groupBy: 'none' | 'productionMethod' | 'order';
}

interface Task {
  id: string;
  orderId: string;
  itemId: string;
  clientName: string;
  itemDetails: {
    size: ItemSize;
    quantity: number;
    description: string;
  };
  taskType: TaskType;
  productionMethod: ProductionMethod;
  estimatedTime: number; // In minutes
  status: TaskStatus;
  priority: boolean;
  dueDate: Date;
  completedAt: Date | null;
}

enum TaskType {
  // Heat Transfer Vinyl
  CUT_VINYL = 'CUT_VINYL',
  WEED_VINYL = 'WEED_VINYL',
  PRESS_SHIRTS = 'PRESS_SHIRTS',
  
  // Sublimation
  PRINT_DESIGN = 'PRINT_DESIGN',
  PRESS = 'PRESS',
  
  // Embroidery
  DIGITIZE = 'DIGITIZE',
  PRODUCTION = 'PRODUCTION'
}

enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}
```

### Public Methods

```typescript
interface TaskManagerAPI {
  // Task Management
  createTask(task: Omit<Task, 'id' | 'status' | 'completedAt'>): Task;
  updateTask(id: string, updates: Partial<Task>): Task;
  deleteTask(id: string): boolean;
  
  // Task Generation
  generateTasksForItem(item: Item, orderId: string, clientName: string, dueDate: Date, priority: boolean): Task[];
  
  // Status Management
  completeTask(id: string): Task;
  reactivateTask(id: string): Task;
  
  // Filtering & Grouping
  filterTasks(filter: TaskManagerState['filter']): Task[];
  groupTasks(tasks: Task[], groupBy: TaskManagerState['groupBy']): Record<string, Task[]>;
  
  // Task Queries
  getPendingTasksByOrderId(orderId: string): Task[];
  getCompletedTasksByOrderId(orderId: string): Task[];
  areAllTasksCompletedForOrder(orderId: string): boolean;
}
```

### Events

```typescript
interface TaskManagerEvents {
  onTaskCreated: (task: Task) => void;
  onTaskCompleted: (task: Task) => void;
  onTaskReactivated: (task: Task) => void;
  onAllOrderTasksCompleted: (orderId: string) => void;
}
```

## 4. Business Card Kanban Board Component API

### State Interface

```typescript
interface BusinessCardBoardState {
  stages: BusinessCardStage[];
  cards: BusinessCard[];
  filter: {
    search: string;
    priority: boolean | null;
  };
  sort: {
    by: 'date' | 'clientName' | 'dueDate';
    order: 'asc' | 'desc';
  };
}

interface BusinessCardStage {
  id: BusinessCardStageType;
  name: string;
}

interface BusinessCard {
  id: string;
  clientName: string;
  clientPhone: string;
  orderDate: Date;
  dueDate: Date;
  priority: boolean;
  description: string;
  quantity: number;
  stage: BusinessCardStageType;
  notes: string;
  designFiles: string[]; // URLs or file references
}

enum BusinessCardStageType {
  ART_NEEDS_DONE = 'ART_NEEDS_DONE',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  APPROVED = 'APPROVED',
  ORDERED_ONLINE = 'ORDERED_ONLINE'
}
```

### Public Methods

```typescript
interface BusinessCardBoardAPI {
  // Card Management
  createCard(card: Omit<BusinessCard, 'id'>): BusinessCard;
  updateCard(id: string, updates: Partial<BusinessCard>): BusinessCard;
  deleteCard(id: string): boolean;
  
  // Stage Management
  moveCard(cardId: string, targetStage: BusinessCardStageType): BusinessCard;
  
  // Design Management
  addDesignFile(cardId: string, fileUrl: string): BusinessCard;
  removeDesignFile(cardId: string, fileUrl: string): BusinessCard;
  
  // Filtering & Sorting
  filterCards(filter: BusinessCardBoardState['filter']): BusinessCard[];
  sortCards(sort: BusinessCardBoardState['sort']): BusinessCard[];
}
```

### Events

```typescript
interface BusinessCardBoardEvents {
  onCardCreated: (card: BusinessCard) => void;
  onCardMoved: (card: BusinessCard, previousStage: BusinessCardStageType) => void;
  onDesignFileAdded: (card: BusinessCard, fileUrl: string) => void;
}
```

## 5. Component Integration Points

### Order Tracker → Shirt Production Kanban Board

```typescript
// When a new order is created
orderTracker.onOrderCreated.subscribe((order) => {
  // Create a new Kanban card in the first stage
  kanbanBoard.createCard(order);
});

// When an order status is updated
orderTracker.onOrderStatusChanged.subscribe((order, previousStatus) => {
  const card = kanbanBoard.getCardByOrderId(order.id);
  if (card) {
    // Map Order status to Kanban stage
    const stageMap: Record<OrderStatus, KanbanStageType> = {
      [OrderStatus.AWAITING]: KanbanStageType.NEW_ORDER,
      [OrderStatus.ORDER_PLACED]: KanbanStageType.ORDER_PLACED,
      [OrderStatus.SHIRTS_ARRIVED]: KanbanStageType.SHIRTS_ARRIVING,
      [OrderStatus.DELIVERED]: KanbanStageType.UNIFORM_COMPLETED
    };
    
    // Move the card to the appropriate stage
    if (stageMap[order.status]) {
      kanbanBoard.moveCard(card.id, stageMap[order.status]);
    }
  }
});
```

### Shirt Production Kanban Board ↔ Task Manager

```typescript
// When a card is moved to Materials Ready stage, generate tasks
kanbanBoard.onCardMoved.subscribe((card, previousStage) => {
  if (card.stage === KanbanStageType.MATERIALS_READY) {
    // Get the original order to access items
    const order = orderTracker.getOrder(card.orderId);
    if (order) {
      // Generate tasks for each item in the order
      order.items.forEach(item => {
        const tasks = taskManager.generateTasksForItem(
          item,
          order.id,
          order.clientName,
          order.dueDate,
          order.priority
        );
      });
    }
  }
});

// When all tasks for an order are completed, move the card to Uniform Completed
taskManager.onAllOrderTasksCompleted.subscribe((orderId) => {
  const card = kanbanBoard.getCardByOrderId(orderId);
  if (card) {
    kanbanBoard.moveCard(card.id, KanbanStageType.UNIFORM_COMPLETED);
  }
});
```

## 6. Utility Interfaces

### Time Calculation Utilities

```typescript
interface TimeCalculationUtils {
  // Heat Transfer Vinyl time calculations
  calculateCutVinylTime(quantity: number): number; // 5 min/unit
  calculateWeedVinylTime(quantity: number): number; // 3 min/unit
  calculatePressShirtsTime(quantity: number): number; // 2 min/unit
  
  // Sublimation time calculations
  calculatePrintDesignTime(quantity: number): number; // 1 min/unit
  calculatePressTime(quantity: number): number; // 2 min/unit
  
  // Embroidery time calculations
  calculateDigitizeTime(quantity: number): number; // 15 min/unit
  calculateEmbroideryProductionTime(quantity: number): number; // 30 min/unit
  
  // Production method total time
  calculateHeatTransferVinylTime(quantity: number): number;
  calculateSublimationTime(quantity: number): number;
  calculateEmbroideryTime(quantity: number): number;
  
  // Item time calculation
  calculateItemTime(productionMethod: ProductionMethod, quantity: number): number;
}
```

### Due Date Calculation Utilities

```typescript
interface DueDateCalculationUtils {
  // Calculate business days
  addBusinessDays(date: Date, days: number): Date;
  isBusinessDay(date: Date): boolean;
  
  // Calculate due date based on quantity tiers
  calculateDueDate(orderDate: Date, totalQuantity: number): Date;
  
  // Get due date tier based on quantity
  getDueDateTier(totalQuantity: number): number; // Returns number of business days
}
```

### Data Transformation Utilities

```typescript
interface DataTransformationUtils {
  // Convert between component data models
  orderToKanbanCard(order: Order): Omit<KanbanCard, 'id' | 'stage' | 'artworkStatus'>;
  itemToTasks(item: Item, orderId: string, clientName: string, dueDate: Date, priority: boolean): Omit<Task, 'id' | 'status' | 'completedAt'>[];
  
  // Map status values between components
  mapOrderStatusToKanbanStage(status: OrderStatus): KanbanStageType;
  mapKanbanStageToOrderStatus(stage: KanbanStageType): OrderStatus;
}
```