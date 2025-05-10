import { useState } from 'react'
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
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderStatus, ProductionMethod, Size } from '@/types'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Form validation schema
const orderItemSchema = z.object({
  id: z.string().optional(),
  size: z.nativeEnum(Size),
  quantity: z.number().int().positive(),
  description: z.string().min(1).max(255),
  productionMethod: z.nativeEnum(ProductionMethod),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.AWAITING),
})

const formSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(3).max(100),
  clientPhone: z.string().regex(/^\d{4,15}$/, 'Phone must be 4-15 digits'),
  orderDate: z.date(),
  dueDate: z.date(),
  isPriority: z.boolean().default(false),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.AWAITING),
})

// Types from the schema
type OrderFormValues = z.infer<typeof formSchema>
type OrderItemValues = z.infer<typeof orderItemSchema>

// Props for the component
interface OrderFormProps {
  defaultValues?: Partial<OrderFormValues>
  onSubmit: (data: OrderFormValues) => void
  isSubmitting?: boolean
}

/**
 * Form for creating and editing orders
 */
export function OrderForm({ 
  defaultValues, 
  onSubmit,
  isSubmitting = false 
}: OrderFormProps) {
  // Generate empty item template
  const emptyItem = (): OrderItemValues => ({
    id: crypto.randomUUID(),
    size: Size.M,
    quantity: 1,
    description: '',
    productionMethod: ProductionMethod.HEAT_TRANSFER_VINYL,
    status: OrderStatus.AWAITING,
  })
  
  // Set up the form with validation
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      isPriority: false,
      status: OrderStatus.AWAITING,
      items: [emptyItem()],
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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Name */}
          <FormField
            control={form.control}
            name="clientName"
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
            name="clientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (last 4 digits)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter at least 4 digits" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Order Date */}
          <FormField
            control={form.control}
            name="orderDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Order Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
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
                    Mark this order as high priority
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
          
          {form.watch('items').map((item, index) => (
            <div key={item.id || index} className="p-4 border rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Item {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={form.watch('items').length <= 1}
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
                              {method.replace('_', ' ')}
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
                              {status.replace('_', ' ')}
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
                      <Input placeholder="Enter item details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        
        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Order'}
        </Button>
      </form>
    </Form>
  )
}