'use client'

import { motion } from 'framer-motion'
import { FileText, Plus, Sparkles } from 'lucide-react'

interface HeaderProps {
  hasSession: boolean
  onNewSession: () => void
  onUploadClick: () => void
}

export function Header({ hasSession, onNewSession, onUploadClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-5 border-b border-ink-700/50">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="relative w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>
          <FileText size={18} className="text-ink-950" strokeWidth={2.5} />
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-jade-400 border-2 border-ink-950" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white"
            style={{ fontFamily: 'var(--font-display)' }}>
            DocMind
          </span>
          <div className="text-[10px] text-ink-500 tracking-widest uppercase font-medium -mt-0.5">
            PDF Intelligence
          </div>
        </div>
      </motion.div>

      {/* Right actions */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2"
      >
        {hasSession && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onUploadClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              text-ink-500 hover:text-amber-300 border border-ink-700 hover:border-amber-400/40
              transition-all duration-200"
          >
            <Plus size={14} />
            New PDF
          </motion.button>
        )}

        {hasSession && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNewSession}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              text-amber-300 bg-amber-400/10 hover:bg-amber-400/15 border border-amber-400/20
              hover:border-amber-400/40 transition-all duration-200"
          >
            <Sparkles size={14} />
            New Session
          </motion.button>
        )}
      </motion.div>
    </header>
  )
}
