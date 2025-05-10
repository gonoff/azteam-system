import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define variants for the stats card
const statsCardVariants = cva('', {
  variants: {
    variant: {
      default: '',
      primary: 'border-primary/20 bg-primary/5',
      success: 'border-green-500/20 bg-green-500/5',
      warning: 'border-yellow-500/20 bg-yellow-500/5',
      danger: 'border-destructive/20 bg-destructive/5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Define variants for the value text
const valueVariants = cva('text-3xl font-bold', {
  variants: {
    variant: {
      default: 'text-foreground',
      primary: 'text-primary',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      danger: 'text-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface StatsCardProps extends VariantProps<typeof statsCardVariants> {
  title: string
  value: string | number
  icon?: ReactNode
  className?: string
  difference?: {
    value: string | number
    isPositive: boolean
  }
}

/**
 * Stats card component for dashboards
 */
export const StatsCard = ({
  title,
  value,
  icon,
  variant,
  className,
  difference,
}: StatsCardProps) => {
  return (
    <Card className={cn(statsCardVariants({ variant }), className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn(valueVariants({ variant }))}>
          {value}
        </div>
        
        {difference && (
          <p className="mt-1 text-xs text-muted-foreground">
            <span className={difference.isPositive ? 'text-green-500' : 'text-destructive'}>
              {difference.isPositive ? '↑' : '↓'} {difference.value}
            </span>
            {' '}from previous period
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default StatsCard