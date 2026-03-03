'use client'

import { motion } from 'framer-motion'
import { FileText, Hash, CheckCircle2 } from 'lucide-react'
import type { SessionInfo } from '@/lib/api'

export function SessionBadge({ session }: { session: SessionInfo }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-ink-900/60 border border-ink-700/50
      backdrop-blur-sm overflow-hidden relative">

      {/* Subtle left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
        style={{ background: 'linear-gradient(180deg, #fbbf24, #34d399)' }} />

      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center flex-shrink-0">
          <FileText size={14} className="text-amber-300" />
        </div>
        <span className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-xs"
          style={{ fontFamily: 'var(--font-display)' }}>
          {session.filename}
        </span>
      </div>

      <div className="flex items-center gap-3 ml-auto flex-shrink-0 text-xs text-ink-500">
        <div className="hidden sm:flex items-center gap-1.5">
          <Hash size={11} className="text-ink-600" />
          <span>{session.total_chunks} chunks</span>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-jade-400"
          />
          <span className="text-jade-400">Ready</span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-ink-600 font-mono text-[10px]">
          <span>{session.session_id.slice(0, 8)}…</span>
        </div>
      </div>
    </div>
  )
}
