import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Text line skeleton for paragraphs and text blocks
 */
export function TextLinesSkeleton({
  lines = 3,
  className,
  ...props
}: {
  lines?: number
  className?: string
  [key: string]: any
}) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array(lines)
        .fill(null)
        .map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              "h-4", 
              i === lines - 1 && lines > 1 ? "w-4/5" : "w-full"
            )} 
          />
        ))}
    </div>
  )
}

/**
 * Card skeleton for list items
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <TextLinesSkeleton lines={2} />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  )
}

/**
 * Grid of card skeletons for lists
 */
export function CardGridSkeleton({
  count = 6,
  columns = { default: 1, sm: 2, lg: 3 },
  className,
}: {
  count?: number
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  className?: string
}) {
  // Map column counts to Tailwind grid classes
  const getGridCols = (cols?: number) => {
    if (!cols) return ''
    return `grid-cols-${cols}`
  }

  // Build responsive class string
  const gridClass = cn(
    'grid gap-4',
    getGridCols(columns.default),
    columns.sm && `sm:${getGridCols(columns.sm)}`,
    columns.md && `md:${getGridCols(columns.md)}`,
    columns.lg && `lg:${getGridCols(columns.lg)}`,
    columns.xl && `xl:${getGridCols(columns.xl)}`,
    className
  )

  return (
    <div className={gridClass}>
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <CardSkeleton key={i} />
        ))}
    </div>
  )
}

/**
 * Form input skeleton
 */
export function FormInputSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

/**
 * Form skeleton
 */
export function FormSkeleton({
  inputCount = 4,
  className,
}: {
  inputCount?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array(inputCount)
        .fill(null)
        .map((_, i) => (
          <FormInputSkeleton key={i} />
        ))}
      <Skeleton className="h-10 w-24 mt-4" />
    </div>
  )
}

/**
 * Stat card skeleton
 */
export function StatsSkeleton({
  count = 4,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </Card>
        ))}
    </div>
  )
}

/**
 * Table skeleton
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex gap-4 border-b pb-2">
        {Array(columns)
          .fill(null)
          .map((_, i) => (
            <Skeleton
              key={`header-${i}`}
              className={cn(
                "h-6",
                i === 0 ? "w-[30%]" : "w-[calc((70%)/3)]"
              )}
            />
          ))}
      </div>
      <div className="space-y-4">
        {Array(rows)
          .fill(null)
          .map((_, rowIdx) => (
            <div key={`row-${rowIdx}`} className="flex gap-4">
              {Array(columns)
                .fill(null)
                .map((_, colIdx) => (
                  <Skeleton
                    key={`cell-${rowIdx}-${colIdx}`}
                    className={cn(
                      "h-6",
                      colIdx === 0 ? "w-[30%]" : "w-[calc((70%)/3)]"
                    )}
                  />
                ))}
            </div>
          ))}
      </div>
    </div>
  )
}

/**
 * Kanban board skeleton
 */
export function KanbanSkeleton({
  columns = 5,
  cardsPerColumn = [3, 2, 4, 1, 2],
  className,
}: {
  columns?: number
  cardsPerColumn?: number[]
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-5 gap-4 h-full", className)}>
      {Array(columns)
        .fill(null)
        .map((_, colIdx) => (
          <div key={colIdx} className="flex flex-col h-full">
            <Skeleton className="h-6 w-24 mb-2 rounded-md" />
            <div className="flex-1 space-y-2 p-2 bg-muted/30 rounded-md">
              {Array(cardsPerColumn[colIdx] || 2)
                .fill(null)
                .map((_, cardIdx) => (
                  <Card key={`col-${colIdx}-card-${cardIdx}`} className="p-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}

/**
 * Dashboard skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
      
      <StatsSkeleton />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-4">
          <Skeleton className="h-6 w-36 mb-6" />
          <TextLinesSkeleton lines={15} />
        </Card>
        <Card className="p-4">
          <Skeleton className="h-6 w-36 mb-6" />
          <TableSkeleton rows={5} columns={3} />
        </Card>
      </div>
    </div>
  )
}

// Export a composite object with all skeleton components
export const Skeletons = {
  TextLines: TextLinesSkeleton,
  Card: CardSkeleton,
  CardGrid: CardGridSkeleton,
  FormInput: FormInputSkeleton,
  Form: FormSkeleton,
  Stats: StatsSkeleton,
  Table: TableSkeleton,
  Kanban: KanbanSkeleton,
  Dashboard: DashboardSkeleton,
}