'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => {} })

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  const { setOpen } = React.useContext(DialogContext)
  return <div onClick={() => setOpen(true)}>{children}</div>
}

export function DialogContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) {
  const { open, setOpen } = React.useContext(DialogContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div
        ref={ref}
        className={cn(
          'relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg',
          className
        )}
      >
        <button
          onClick={() => setOpen(false)}
          className='absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100'
        >
          <X className='h-4 w-4' />
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('flex flex-col space-y-1.5', className)}>{children}</div>
}

export function DialogTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) {
  return <h2 className={cn('text-lg font-semibold', className)}>{children}</h2>
}

export function DialogDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

export function DialogFooter({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('flex justify-end gap-2 mt-4', className)}>{children}</div>
}
