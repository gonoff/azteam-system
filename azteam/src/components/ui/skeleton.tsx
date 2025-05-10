import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

/**
 * Basic skeleton loader component for showing loading states
 */
function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  )
}

export { Skeleton }