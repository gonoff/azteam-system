# Order Tracker Features Guide

This document provides a detailed guide on how to test and use the Order Tracker features that have been implemented.

## Starting the Development Server

To start the development server and test the Order Tracker features:

1. **Navigate to the project directory**
   ```bash
   cd ~/Documents/azteam-system/azteam
   ```

2. **Install dependencies** (if you haven't already)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to the URL shown in your terminal (typically http://localhost:5173)

## Navigating to Order Tracker

1. Once the application is running, you can access the Order Tracker by:
   - Clicking on the "Orders" button in the navigation bar
   - Or directly navigating to http://localhost:5173/orders

## Key Features Overview

The Order Tracker consists of the following main components:

### 1. Order List View

The Order List view displays all orders in a grid layout with filtering and sorting capabilities.

**Features to test:**
- **Search**: Enter text in the search box to filter orders by client name, order number, etc.
- **Filtering**: 
  - Click the filter button to open the filter panel
  - Filter by status, production method, priority, and date range
  - Apply filters to see the filtered results
  - Active filters appear as badges that can be individually removed
- **Sorting**: 
  - Click on the sort buttons to sort by date, due date, client, status, or priority
  - Click again to toggle between ascending and descending order
- **Create Order**: Click the "New Order" button to open the order creation form

### 2. OrderCard Component

Each order is displayed as a card with expandable/collapsible functionality.

**Features to test:**
- **Basic Information**: View client name, order number, dates, and status at a glance
- **Due Date Indicators**: 
  - Past due dates appear in red
  - Approaching due dates (within 2 days) appear in amber
- **Priority Indicator**: Priority orders show a red left border and alert icon
- **Expand/Collapse**: Click "Show More" to expand the card and see order items
- **Production Method Icons**: Icons indicate the different production methods used
- **Item Details**: Expanded view shows size, quantity, description, and production method for each item
- **Status Management**: If implemented, use the status dropdown to change order status
- **Actions**: Use the action buttons to edit, duplicate, or delete orders

### 3. Order Form

The Order Form allows creating and editing orders with dynamic item management.

**Features to test:**
- **Client Information**: Add or edit client details
- **Order Details**: Set order date, due date, priority status
- **Dynamic Items**: 
  - Add multiple items with different sizes, quantities, and production methods
  - Remove items as needed
  - See the auto-calculation of time estimates based on items
- **Auto Due Date**: See how due date is automatically suggested based on quantities and methods
- **Form Validation**: Check that validation prevents submitting invalid data

## Testing Workflow

To thoroughly test the Order Tracker functionality, follow this workflow:

1. **Create a New Order**
   - Click "New Order" button
   - Fill in client information
   - Add several items with different production methods
   - Set priority status if desired
   - See how due date is calculated
   - Submit the form

2. **Filter and Sort Orders**
   - Use search to find your new order
   - Apply various filters to test filtering functionality
   - Try different sorting options to see how orders are organized

3. **View and Expand Order Details**
   - Find your order in the list
   - Click "Show More" to expand and see items
   - Check that all item details are displayed correctly

4. **Edit an Order**
   - Click the edit icon (pencil) on an order card
   - Modify some details
   - Add or remove items
   - Save changes and verify they appear correctly

5. **Change Order Status**
   - If implemented, use the status dropdown to change an order's status
   - Verify that the status badge updates with the appropriate color

6. **Delete an Order**
   - Click the delete icon (trash) on an order card
   - Confirm deletion
   - Verify that the order is removed from the list

## Integration with Other Modules

The Order Tracker is designed to integrate with other modules in the system:

- **Shirt Kanban**: Orders with shirt items should create cards in the Shirt Kanban board
- **Task Manager**: Production methods on order items should generate appropriate tasks

These integrations may be implemented in future updates.

## Known Limitations

- The current implementation uses in-memory storage with Zustand, so data will be lost on page refresh unless local storage persistence is implemented
- Some features like order number generation may not be fully implemented
- Responsive design may need improvement on smaller screens

## Troubleshooting

If you encounter issues:

- **Blank Screen**: Check browser console for errors
- **Form Submission Errors**: Verify all required fields are completed
- **Filter Not Working**: Clear all filters and try again with a single filter
- **Card Actions Not Responding**: Make sure you're clicking on the action button itself, not surrounding areas

## Next Steps for Development

Future enhancements to consider:

- Implement persistent storage with LocalStorage
- Add confirmation dialogs for delete actions
- Enhance responsiveness for mobile devices
- Add order details page with more comprehensive information
- Implement order history tracking
- Add order export functionality