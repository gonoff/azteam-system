import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6

interface CardGridProps {
  children: ReactNode
  columns?: {
    default?: GridColumns
    sm?: GridColumns
    md?: GridColumns
    lg?: GridColumns
    xl?: GridColumns
  }
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Responsive card grid component for dashboard layouts
 */
export const CardGrid = ({
  children,
  columns = {
    default: 1,
    sm: 2,
    lg: 3,
    xl: 4
  },
  gap = 'md',
  className
}: CardGridProps) => {
  // Map gap size to Tailwind classes
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
  
  // Map column counts to Tailwind grid classes
  const getGridCols = (cols?: GridColumns) => {
    if (!cols) return ''
    return `grid-cols-${cols}`
  }
  
  // Build responsive class string
  const gridClass = cn(
    'grid',
    gapClasses[gap],
    getGridCols(columns.default),
    columns.sm && `sm:${getGridCols(columns.sm)}`,
    columns.md && `md:${getGridCols(columns.md)}`,
    columns.lg && `lg:${getGridCols(columns.lg)}`,
    columns.xl && `xl:${getGridCols(columns.xl)}`,
    className
  )
  
  return (
    <div className={gridClass}>
      {children}
    </div>
  )
}

export default CardGrid