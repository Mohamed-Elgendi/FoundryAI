'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  children: React.ReactNode
  trigger: React.ReactNode
  className?: string
}

export function DropdownMenu({ children, trigger, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className='absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 shadow-md'>
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownMenuItem({ 
  children, 
  className,
  onClick 
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('-mx-1 my-1 h-px bg-muted', className)} />
}
