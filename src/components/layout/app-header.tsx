import { Scissors } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-sm shadow-emerald-600/25 ring-1 ring-emerald-500/20">
            <Scissors
              className="size-4.5"
              strokeWidth={2.3}
            />
          </div>

          <span className="text-base font-extrabold tracking-tight text-slate-900">
            Splitify
          </span>
        </div>

        <div className="flex items-center">
          <div className="inline-flex items-center rounded-full border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/40 to-slate-50 px-3.5 py-1.5 shadow-2xs ring-1 ring-slate-900/[0.04] backdrop-blur-sm select-none">
            <span className="text-xs font-bold tracking-tight text-slate-800">
              Private &amp; Offline
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

