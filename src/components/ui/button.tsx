import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-barlow font-extrabold uppercase tracking-[0.2em] text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'cursor-pointer bg-primary text-primary-foreground hover:opacity-90 [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)]',
        destructive:
          'bg-destructive text-white hover:opacity-90 [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)]',
        outline:
          'border-2 border-primary bg-transparent text-primary hover:bg-primary/10 [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)]',
        secondary:
          'cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)]',
        ghost:
          'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot='button'
      {...props}
    />
  )
}

export { Button, buttonVariants }
