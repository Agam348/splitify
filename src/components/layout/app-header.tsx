import { Scissors, ShieldCheck } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm shadow-blue-500/25 ring-1 ring-blue-500/20">
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
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 font-mono">
                v0.1.0
              </span>
            </div>
            <p className="text-xs font-normal text-slate-500">
              Lossless Master Video Cutter
            </p>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Splitify
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/40 to-slate-50 px-3.5 py-1.5 shadow-2xs ring-1 ring-slate-900/[0.04] backdrop-blur-sm transition-all duration-150 hover:border-slate-300 hover:shadow-xs select-none">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>

            <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />

            <span className="text-xs font-bold tracking-tight text-slate-800">
              Private &amp; Offline
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

