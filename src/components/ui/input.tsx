import * as React from 'react'

import { cn } from '../../lib/utils'

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs transition-all duration-150 placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-75',
      className,
    )}
    {...props}
  />
))

Input.displayName = 'Input'

export { Input }
