import { useState } from 'react'
import { CheckIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Task, TaskStatus, ProductionMethod, TaskType } from '@/types'
import { Badge } from '@/components/ui/badge'

interface TaskCardProps {
  task: Task
  onStatusChange?: (taskId: string, status: TaskStatus) => void
  onComplete?: (taskId: string) => void
  onView?: (taskId: string) => void
  className?: string
}

/**
 * Card component for displaying and managing tasks
 */
export function TaskCard({
  task,
  onStatusChange,
  onComplete,
  onView,
  className,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Format production method for display
  const formatMethod = (method: ProductionMethod) => {
    return method.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  // Format task type for display
  const formatTaskType = (type: TaskType) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  // Get badge variant based on task status
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return <Badge variant="outline">Pending</Badge>
      case TaskStatus.IN_PROGRESS:
        return <Badge variant="secondary">In Progress</Badge>
      case TaskStatus.COMPLETED:
        return <Badge variant="success">Completed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Card
      className={cn(
        'transition-all',
        task.isPriority ? 'border-l-4 border-l-red-500' : '',
        task.status === TaskStatus.COMPLETED ? 'bg-muted/30' : '',
        task.status === TaskStatus.IN_PROGRESS ? 'border-primary/50' : '',
        className
      )}
    >
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">
              {formatTaskType(task.taskType)}
              {task.isPriority && (
                <AlertTriangleIcon className="h-4 w-4 text-red-500 inline ml-1" />
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{task.clientName}</p>
          </div>
          {getStatusBadge(task.status as TaskStatus)}
        </div>

        <div className="flex items-center text-sm">
          <ClockIcon className="h-3 w-3 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">Est. time:</span>
          <span className="ml-1 font-medium">{task.estimatedMinutes} min</span>
        </div>

        {expanded && (
          <div className="mt-3 text-sm border-t pt-3">
            <p className="mb-1">
              <span className="text-muted-foreground">Method:</span>
              <span className="ml-1">{formatMethod(task.productionMethod as ProductionMethod)}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Description:</span>
              <span className="ml-1">{task.description}</span>
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>

        <div className="flex gap-1">
          {task.status !== TaskStatus.COMPLETED && onComplete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComplete(task.id)}
              className="text-green-500 hover:text-green-600"
            >
              <CheckIcon className="h-4 w-4" />
            </Button>
          )}

          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(task.id)}
            >
              View
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}