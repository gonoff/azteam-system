import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, TaskStatus } from '@/types'

// Define the store state and actions
interface TaskState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => string
  updateTask: (id: string, updates: Partial<Task>) => void
  completeTask: (id: string) => void
  deleteTask: (id: string) => void
  getTasksByStatus: (status: TaskStatus) => Task[]
  getTasksByCardId: (kanbanCardId: string) => Task[]
}

// Create Zustand store with persistence
export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      // Add a new task
      addTask: (task) => {
        const id = crypto.randomUUID()
        set((state) => ({
          tasks: [
            ...state.tasks,
            { 
              ...task, 
              id, 
              createdAt: new Date().toISOString(),
              completedAt: null,
            }
          ]
        }))
        return id
      },
      
      // Update an existing task
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id 
            ? { ...task, ...updates } 
            : task
        )
      })),
      
      // Mark a task as completed
      completeTask: (id) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id 
            ? { 
                ...task, 
                status: 'COMPLETED',
                completedAt: new Date().toISOString(),
              } 
            : task
        )
      })),
      
      // Delete a task
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      
      // Get tasks by status
      getTasksByStatus: (status) => {
        return get().tasks.filter(task => task.status === status)
      },
      
      // Get tasks by kanban card ID
      getTasksByCardId: (kanbanCardId) => {
        return get().tasks.filter(task => task.kanbanCardId === kanbanCardId)
      }
    }),
    {
      name: 'tasks-storage',
    }
  )
)