import { useState, useEffect } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderStatus, ProductionMethod, Size, ArtworkStatus } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, CalendarIcon, Clock, PlusCircle, Trash2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useOrderStore } from '@/store/orderStore'
import { toastService } from '@/utils/toast'
import { calculateDueDate, calculateEstimatedTime } from '@/types/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FormErrorSummary } from '@/components/shared'
import { createOrderSchema, type CreateOrderInput } from '@/lib/validations/orderSchema'

// Helper to convert date string to Date object and back for form handling
const dateTransformer = {
  input: (value: string | Date) => (typeof value === 'string' ? new Date(value) : value),
  output: (date: Date) => date.toISOString()
}

// Props for the component
interface OrderFormProps {
  defaultValues?: Partial<CreateOrderInput>
  onSubmit?: (data: CreateOrderInput) => void
  onSuccess?: (orderId: string) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

/**
 * Form for creating and editing orders
 */
export function OrderForm({
  defaultValues,
  onSubmit: propOnSubmit,
  onSuccess,
  onCancel,
  isSubmitting: propIsSubmitting = false
}: OrderFormProps) {
  const [internalSubmitting, setInternalSubmitting] = useState(false)
  const isSubmitting = propIsSubmitting || internalSubmitting

  // Get the addOrder function from the store
  const addOrder = useOrderStore(state => state.addOrder)

  // Generate empty item template
  const emptyItem = () => ({
    id: crypto.randomUUID(),
    size: Size.M,
    quantity: 1,
    description: '',
    productionMethod: ProductionMethod.HEAT_TRANSFER_VINYL,
    status: OrderStatus.PENDING,
    artworkStatus: ArtworkStatus.NEEDS_CREATION,
  })

  // Generate empty client info template
  const emptyClientInfo = () => ({
    name: '',
    phone: '',
    email: '',
    address: '',
    company: '',
    notes: '',
  })

  // Set up the form with validation
  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      client: emptyClientInfo(),
      orderDate: new Date().toISOString(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      isPriority: false,
      status: OrderStatus.PENDING,
      items: [emptyItem()],
      notes: '',
      ...defaultValues,
    },
  })

  // Add a new item to the order
  const addItem = () => {
    const currentItems = form.getValues('items') || []
    form.setValue('items', [...currentItems, emptyItem()], { shouldValidate: true })
  }

  // Remove an item from the order
  const removeItem = (index: number) => {
    const currentItems = form.getValues('items')
    if (currentItems.length > 1) {
      form.setValue(
        'items',
        currentItems.filter((_, i) => i !== index),
        { shouldValidate: true }
      )
    }
  }

  // Auto-calculate due date when items or priority changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Only recalculate if items or isPriority changed
      if (name && (name.startsWith('items') || name === 'isPriority')) {
        const items = value.items || []
        const isPriority = value.isPriority || false

        if (items.length > 0) {
          // Calculate total quantity across all items
          const totalQuantity = items.reduce((sum, item) => sum + (item?.quantity || 0), 0)

          // Get all production methods used
          const methods = items
            .map(item => item?.productionMethod)
            .filter((method): method is ProductionMethod => !!method)

          // Calculate suggested due date based on quantity, methods, and priority
          const orderDate = new Date(value.orderDate || new Date())
          const suggestedDueDate = calculateDueDate(
            orderDate,
            totalQuantity,
            methods,
            isPriority
          )

          // Update the due date in the form
          form.setValue('dueDate', suggestedDueDate.toISOString())

          // Calculate and update estimated production time for each item
          items.forEach((item, index) => {
            if (item && item.productionMethod && item.quantity) {
              const estimatedTime = calculateEstimatedTime(
                item.productionMethod,
                null, // Calculate total time for all tasks
                item.quantity
              )
              form.setValue(`items.${index}.estimatedTime`, estimatedTime)
            }
          })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setInternalSubmitting(true)

      if (propOnSubmit) {
        // Use the provided onSubmit prop if available
        await propOnSubmit(data)
      } else {
        // Otherwise use the store directly
        const orderId = addOrder(data)
        toastService.success('Order created successfully')

        if (onSuccess) {
          onSuccess(orderId)
        }
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      toastService.error('Failed to save order')
    } finally {
      setInternalSubmitting(false)
    }
  })
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Information Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Client Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name */}
            <FormField
              control={form.control}
              name="client.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Phone */}
            <FormField
              control={form.control}
              name="client.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Email */}
            <FormField
              control={form.control}
              name="client.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Company */}
            <FormField
              control={form.control}
              name="client.company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Address */}
            <FormField
              control={form.control}
              name="client.address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter address" {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Notes */}
            <FormField
              control={form.control}
              name="client.notes"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Client Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter any notes about the client" {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Order Details Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Order Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Date */}
            <FormField
              control={form.control}
              name="orderDate"
              render={({ field: { value, onChange, ...field } }) => {
                // Convert ISO string to Date for the calendar component
                const date = value ? dateTransformer.input(value) : new Date()

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Order Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                            {...field}
                          >
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => onChange(date ? dateTransformer.output(date) : '')}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field: { value, onChange, ...field } }) => {
                // Convert ISO string to Date for the calendar component
                const date = value ? dateTransformer.input(value) : new Date()

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                            {...field}
                          >
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => onChange(date ? dateTransformer.output(date) : '')}
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      <span className="flex items-center text-sm mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Auto-calculated based on order items and priority
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            {/* Is Priority */}
            <FormField
              control={form.control}
              name="isPriority"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Priority Order</FormLabel>
                    <FormDescription>
                      Mark this order as high priority (expedites due date)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Order Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(OrderStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Order Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter any notes about the order" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Order Items Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Order Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          {/* Alert if no items */}
          {(!form.watch('items') || form.watch('items').length === 0) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No items added</AlertTitle>
              <AlertDescription>
                You need to add at least one item to the order.
              </AlertDescription>
            </Alert>
          )}

          {form.watch('items')?.map((item, index) => (
            <div key={item.id || index} className="p-4 border rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Item {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={form.watch('items')?.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Item Size */}
                <FormField
                  control={form.control}
                  name={`items.${index}.size`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Size).map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Item Quantity */}
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Color */}
                <FormField
                  control={form.control}
                  name={`items.${index}.color`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Production Method */}
                <FormField
                  control={form.control}
                  name={`items.${index}.productionMethod`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Production Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ProductionMethod).map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.split('_').map(word =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Artwork Status */}
                <FormField
                  control={form.control}
                  name={`items.${index}.artworkStatus`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artwork Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ArtworkStatus.NEEDS_CREATION}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ArtworkStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.split('_').map(word =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Item Status */}
                <FormField
                  control={form.control}
                  name={`items.${index}.status`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(OrderStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.split('_').map(word =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Item Description */}
              <FormField
                control={form.control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter item details" {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Item Notes */}
              <FormField
                control={form.control}
                name={`items.${index}.notes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any notes about this item" {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estimated Time (readonly) */}
              {form.watch(`items.${index}.estimatedTime`) && (
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Estimated Production Time: {form.watch(`items.${index}.estimatedTime`)} minutes
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Error Summary */}
        {form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0 && (
          <FormErrorSummary errors={form.formState.errors} />
        )}

        {/* Form Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Order'}
          </Button>
        </div>
      </form>
    </Form>
  )
}