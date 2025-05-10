import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Button } from './button'

describe('Button component', () => {
  it('renders the button with children', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
  
  it('applies variants correctly', () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>)
    
    let button = screen.getByRole('button', { name: /destructive/i })
    expect(button).toHaveClass('bg-destructive')
    
    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button', { name: /outline/i })
    expect(button).toHaveClass('border')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    button = screen.getByRole('button', { name: /secondary/i })
    expect(button).toHaveClass('bg-secondary')
  })
  
  it('applies sizes correctly', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    
    let button = screen.getByRole('button', { name: /default/i })
    expect(button).toHaveClass('h-10')
    
    rerender(<Button size="sm">Small</Button>)
    button = screen.getByRole('button', { name: /small/i })
    expect(button).toHaveClass('h-9')
    
    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button', { name: /large/i })
    expect(button).toHaveClass('h-11')
  })
  
  it('passes additional props', () => {
    render(<Button data-testid="test-button">Test Props</Button>)
    
    const button = screen.getByTestId('test-button')
    expect(button).toBeInTheDocument()
  })
  
  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
  })
})