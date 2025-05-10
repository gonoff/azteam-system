import { useState } from 'react'
import { useOrderStore, OrderFilter, OrderSortOption, OrderSortDirection } from '@/store/orderStore'
import { Order, OrderStatus, ProductionMethod } from '@/types'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeadRow,
  CalendarMonthView, 
  CalendarTitle,
  CalendarViewControl,
} from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowUpDown,
  CalendarIcon,
  Filter,
  ListFilter,
  Loader2,
  PlusCircle,
  Search,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { OrderCard } from './OrderCard'

interface OrderListProps {
  onCreateOrder?: () => void
  onOrderSelect?: (orderId: string) => void
  loading?: boolean
}

/**
 * Order list component with filtering and sorting
 */
export function OrderList({ onCreateOrder, onOrderSelect, loading = false }: OrderListProps) {
  // Access orders from store
  const getFilteredOrders = useOrderStore(state => state.getFilteredOrders)
  const setFilter = useOrderStore(state => state.setFilter)
  const setSorting = useOrderStore(state => state.setSorting)
  const clearFilters = useOrderStore(state => state.clearFilters)
  const filter = useOrderStore(state => state.filter)
  const sortBy = useOrderStore(state => state.sortBy)
  const sortDirection = useOrderStore(state => state.sortDirection)
  
  // Local state for advanced filter UI
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [localFilter, setLocalFilter] = useState<OrderFilter>(filter)
  
  // Get filtered orders
  const orders = getFilteredOrders()
  
  // Handle search input
  const handleSearch = (value: string) => {
    setLocalFilter(prev => ({ ...prev, search: value }))
    setFilter({ ...filter, search: value })
  }
  
  // Handle status filter
  const handleStatusFilter = (status: OrderStatus, checked: boolean) => {
    const currentStatuses = localFilter.status || []
    let newStatuses: OrderStatus[]
    
    if (checked) {
      newStatuses = [...currentStatuses, status]
    } else {
      newStatuses = currentStatuses.filter(s => s !== status)
    }
    
    setLocalFilter(prev => ({ ...prev, status: newStatuses }))
  }
  
  // Handle production method filter
  const handleMethodFilter = (method: ProductionMethod, checked: boolean) => {
    const currentMethods = localFilter.productionMethod || []
    let newMethods: ProductionMethod[]
    
    if (checked) {
      newMethods = [...currentMethods, method]
    } else {
      newMethods = currentMethods.filter(m => m !== method)
    }
    
    setLocalFilter(prev => ({ ...prev, productionMethod: newMethods }))
  }
  
  // Handle priority filter
  const handlePriorityFilter = (checked: boolean) => {
    setLocalFilter(prev => ({ ...prev, priorityOnly: checked }))
  }
  
  // Handle date range filter
  const handleDateRangeFilter = (field: 'start' | 'end', date: Date | undefined) => {
    const dateRange = localFilter.dateRange || {}
    
    if (date) {
      dateRange[field] = date.toISOString()
    } else {
      delete dateRange[field]
    }
    
    setLocalFilter(prev => ({ ...prev, dateRange }))
  }
  
  // Apply all filters
  const applyFilters = () => {
    setFilter(localFilter)
    setIsFiltersOpen(false)
  }
  
  // Reset filters
  const resetFilters = () => {
    clearFilters()
    setLocalFilter({})
    setIsFiltersOpen(false)
  }
  
  // Handle sorting
  const handleSort = (by: OrderSortOption) => {
    const direction = by === sortBy && sortDirection === 'asc' ? 'desc' : 'asc'
    setSorting(by, direction)
  }
  
  return (
    <div className="space-y-4">
      {/* Header and Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Orders</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-8"
              value={filter.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {filter.search && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={() => handleSearch('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Filter Button */}
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-[400px] p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Orders</h4>
                
                {/* Status Filter */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Status</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(OrderStatus).map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`status-${status}`} 
                          checked={localFilter.status?.includes(status)}
                          onCheckedChange={(checked) => 
                            handleStatusFilter(status, checked as boolean)
                          }
                        />
                        <Label htmlFor={`status-${status}`}>
                          {status.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Production Method Filter */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Production Method</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(ProductionMethod).map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`method-${method}`} 
                          checked={localFilter.productionMethod?.includes(method)}
                          onCheckedChange={(checked) => 
                            handleMethodFilter(method, checked as boolean)
                          }
                        />
                        <Label htmlFor={`method-${method}`}>
                          {method.split('_').map(word => 
                            word.charAt(0) + word.slice(1).toLowerCase()
                          ).join(' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Priority Filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="priority-only" 
                    checked={localFilter.priorityOnly}
                    onCheckedChange={(checked) => 
                      handlePriorityFilter(checked as boolean)
                    }
                  />
                  <Label htmlFor="priority-only">Priority Orders Only</Label>
                </div>
                
                {/* Date Range Filter */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Date Range</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="date-from">From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date-from"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !localFilter.dateRange?.start && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {localFilter.dateRange?.start ? (
                              format(new Date(localFilter.dateRange.start), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={localFilter.dateRange?.start ? new Date(localFilter.dateRange.start) : undefined}
                            onSelect={(date) => handleDateRangeFilter('start', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="date-to">To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date-to"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !localFilter.dateRange?.end && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {localFilter.dateRange?.end ? (
                              format(new Date(localFilter.dateRange.end), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={localFilter.dateRange?.end ? new Date(localFilter.dateRange.end) : undefined}
                            onSelect={(date) => handleDateRangeFilter('end', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                {/* Filter Actions */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button size="sm" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Create Order Button */}
          <Button onClick={onCreateOrder}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {Object.keys(filter).length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">Filters:</span>
          
          {filter.search && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: {filter.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilter({ ...filter, search: undefined })}
              />
            </Badge>
          )}
          
          {filter.status?.map(status => (
            <Badge key={status} variant="outline" className="flex items-center gap-1">
              Status: {status.replace('_', ' ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newStatuses = filter.status?.filter(s => s !== status)
                  setFilter({ 
                    ...filter, 
                    status: newStatuses?.length ? newStatuses : undefined 
                  })
                }}
              />
            </Badge>
          ))}
          
          {filter.productionMethod?.map(method => (
            <Badge key={method} variant="outline" className="flex items-center gap-1">
              Method: {method.split('_').map(word => 
                word.charAt(0) + word.slice(1).toLowerCase()
              ).join(' ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newMethods = filter.productionMethod?.filter(m => m !== method)
                  setFilter({ 
                    ...filter, 
                    productionMethod: newMethods?.length ? newMethods : undefined 
                  })
                }}
              />
            </Badge>
          ))}
          
          {filter.priorityOnly && (
            <Badge variant="outline" className="flex items-center gap-1">
              Priority Only
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilter({ ...filter, priorityOnly: undefined })}
              />
            </Badge>
          )}
          
          {filter.dateRange?.start && (
            <Badge variant="outline" className="flex items-center gap-1">
              From: {format(new Date(filter.dateRange.start), "PP")}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const { start, ...rest } = filter.dateRange || {}
                  setFilter({ 
                    ...filter, 
                    dateRange: Object.keys(rest).length ? rest : undefined 
                  })
                }}
              />
            </Badge>
          )}
          
          {filter.dateRange?.end && (
            <Badge variant="outline" className="flex items-center gap-1">
              To: {format(new Date(filter.dateRange.end), "PP")}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const { end, ...rest } = filter.dateRange || {}
                  setFilter({ 
                    ...filter, 
                    dateRange: Object.keys(rest).length ? rest : undefined 
                  })
                }}
              />
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7"
            onClick={resetFilters}
          >
            Clear All
          </Button>
        </div>
      )}
      
      {/* Sort Controls */}
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7", sortBy === 'orderDate' && "bg-muted")}
          onClick={() => handleSort('orderDate')}
        >
          Date
          {sortBy === 'orderDate' && (
            <ArrowUpDown className={cn(
              "ml-1 h-3.5 w-3.5",
              sortDirection === 'desc' && "rotate-180"
            )} />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7", sortBy === 'dueDate' && "bg-muted")}
          onClick={() => handleSort('dueDate')}
        >
          Due Date
          {sortBy === 'dueDate' && (
            <ArrowUpDown className={cn(
              "ml-1 h-3.5 w-3.5",
              sortDirection === 'desc' && "rotate-180"
            )} />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7", sortBy === 'clientName' && "bg-muted")}
          onClick={() => handleSort('clientName')}
        >
          Client
          {sortBy === 'clientName' && (
            <ArrowUpDown className={cn(
              "ml-1 h-3.5 w-3.5",
              sortDirection === 'desc' && "rotate-180"
            )} />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7", sortBy === 'status' && "bg-muted")}
          onClick={() => handleSort('status')}
        >
          Status
          {sortBy === 'status' && (
            <ArrowUpDown className={cn(
              "ml-1 h-3.5 w-3.5",
              sortDirection === 'desc' && "rotate-180"
            )} />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7", sortBy === 'priority' && "bg-muted")}
          onClick={() => handleSort('priority')}
        >
          Priority
          {sortBy === 'priority' && (
            <ArrowUpDown className={cn(
              "ml-1 h-3.5 w-3.5",
              sortDirection === 'desc' && "rotate-180"
            )} />
          )}
        </Button>
      </div>
      
      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <ListFilter className="h-10 w-10 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">No orders found</CardTitle>
              <CardDescription className="text-center max-w-sm mb-4">
                {Object.keys(filter).length > 0 
                  ? "No orders match your current filters. Try adjusting your search criteria."
                  : "There are no orders yet. Create your first order to get started."}
              </CardDescription>
              <Button onClick={onCreateOrder}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={onOrderSelect}
                onStatusChange={(id, status) => {
                  const updateOrder = useOrderStore.getState().updateOrder
                  updateOrder(id, { status })
                }}
                onEdit={onOrderSelect}
                onDuplicate={(id) => {
                  const duplicateOrder = useOrderStore.getState().duplicateOrder
                  duplicateOrder(id)
                }}
                onDelete={(id) => {
                  const deleteOrder = useOrderStore.getState().deleteOrder
                  deleteOrder(id)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderList