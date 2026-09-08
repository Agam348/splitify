import { Scissors, ShieldCheck } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-500/25 ring-1 ring-indigo-500/20">
            <Scissors
              className="size-4.5"
              strokeWidth={2.3}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Splitify
              </span>
              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 font-mono">
                v0.1.0
              </span>
            </div>
            <p className="text-xs font-normal text-slate-500">
              Lossless Master Video Cutter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-50/80 px-3 py-1 text-xs font-medium text-slate-600">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>100% Offline</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>Local Engine Ready</span>
          </div>
        </div>
      </div>
    </header>
  )
}

