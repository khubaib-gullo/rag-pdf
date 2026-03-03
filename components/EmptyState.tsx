'use client'

import { motion } from 'framer-motion'
import { Upload, Zap, Brain, Shield } from 'lucide-react'

const features = [
  { icon: Brain, label: 'Semantic Search', desc: 'Cohere embeddings understand context, not just keywords' },
  { icon: Zap, label: 'Instant Answers', desc: 'Groq LLaMA 3.3 70B responds in seconds' },
  { icon: Shield, label: 'Source Citations', desc: 'Every answer references the exact page it came from' },
]

export function EmptyState({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Animated orb */}
        <div className="relative mx-auto w-24 h-24 mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, rgba(251,191,36,0.6), rgba(16,185,129,0.3), rgba(251,191,36,0.1), rgba(251,191,36,0.6))',
            }}
          />
          <div className="absolute inset-[3px] rounded-full bg-ink-950 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-3xl">📄</span>
            </motion.div>
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white"
          style={{ fontFamily: 'var(--font-display)' }}>
          Ask your{' '}
          <span className="relative">
            <span style={{ background: 'linear-gradient(90deg, #fbbf24, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              documents
            </span>
          </span>
          {' '}anything
        </h1>
        <p className="text-ink-500 text-lg max-w-md mx-auto leading-relaxed">
          Upload a PDF and start a conversation. Get precise answers with page-level citations powered by Cohere + Groq.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={onGetStarted}
        className="relative group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-ink-950
          overflow-hidden transition-all duration-200"
        style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', fontFamily: 'var(--font-display)' }}
      >
        <Upload size={20} strokeWidth={2.5} />
        Upload a PDF to begin
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)' }}
        />
        <span className="relative z-10 flex items-center gap-3">
          <Upload size={20} strokeWidth={2.5} />
          Upload a PDF to begin
        </span>
      </motion.button>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-3 gap-4 w-full max-w-2xl"
      >
        {features.map(({ icon: Icon, label, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.08 }}
            className="p-4 rounded-xl border border-ink-700/60 bg-ink-900/40
              hover:border-amber-400/20 hover:bg-ink-800/40 transition-all duration-300 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center mb-3
              group-hover:bg-amber-400/15 transition-colors">
              <Icon size={16} className="text-amber-300" />
            </div>
            <div className="text-sm font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {label}
            </div>
            <div className="text-xs text-ink-500 leading-relaxed">{desc}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
