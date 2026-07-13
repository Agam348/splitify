import { Scissors } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Scissors
              className="size-4"
              strokeWidth={2.4}
            />
          </div>

          <div>
            <p className="text-lg font-bold leading-none tracking-tight">
              Splitify
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Video splitting, simplified
            </p>
          </div>
        </div>

        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
          Offline &amp; private
        </span>
      </div>
    </header>
  )
}
