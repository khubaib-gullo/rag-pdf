'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Send, BookOpen, ChevronDown, ChevronUp, Bot, User, Sparkles } from 'lucide-react'
import type { Message } from '@/lib/api'
import clsx from 'clsx'

const SUGGESTIONS = [
  'What is this document about?',
  'Summarise the key findings',
  'What are the main conclusions?',
  'List the important dates or numbers',
]

interface ChatPanelProps {
  messages: Message[]
  onAsk: (q: string) => void
  isAsking: boolean
  onUploadNew: () => void
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
          className="w-1.5 h-1.5 rounded-full bg-amber-400"
        />
      ))}
    </div>
  )
}

function SourcesDrawer({ sources }: { sources: NonNullable<Message['sources']> }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-3 border-t border-ink-700/50 pt-3">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-xs text-ink-500 hover:text-amber-300 transition-colors"
      >
        <BookOpen size={12} />
        {sources.length} source{sources.length !== 1 ? 's' : ''} referenced
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {sources.map((src, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 bg-ink-950/60 border border-ink-700/40 text-xs"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 font-mono text-[10px]">
                      p.{src.page}
                    </span>
                    <span className="text-ink-600">chunk #{src.chunk_index}</span>
                  </div>
                  <p className="text-ink-400 leading-relaxed">{src.chunk_preview}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={clsx('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {/* Avatar — assistant */}
      {!isUser && (
        <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20
          flex items-center justify-center">
          <Bot size={15} className="text-amber-300" />
        </div>
      )}

      <div className={clsx('max-w-[80%] space-y-0.5', isUser ? 'items-end' : 'items-start', 'flex flex-col')}>
        {/* Timestamp */}
        <span className={clsx('text-[10px] text-ink-600 px-1', isUser && 'text-right')}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* Bubble */}
        <div
          className={clsx(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'rounded-tr-sm text-white'
              : 'rounded-tl-sm text-ink-200 border border-ink-700/50',
          )}
          style={isUser
            ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0a0a0f' }
            : { background: '#1a1a24' }
          }
        >
          {msg.isLoading ? (
            <ThinkingDots />
          ) : isUser ? (
            <p className="font-medium">{msg.content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Model tag + sources */}
        {!isUser && !msg.isLoading && msg.model_used && (
          <div className="px-1 w-full">
            <div className="flex items-center gap-1.5 text-[10px] text-ink-600">
              <Sparkles size={9} className="text-jade-400" />
              <span className="font-mono">{msg.model_used}</span>
            </div>
            {msg.sources && msg.sources.length > 0 && (
              <SourcesDrawer sources={msg.sources} />
            )}
          </div>
        )}
      </div>

      {/* Avatar — user */}
      {isUser && (
        <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30
          flex items-center justify-center">
          <User size={15} className="text-amber-300" />
        </div>
      )}
    </motion.div>
  )
}

export function ChatPanel({ messages, onAsk, isAsking, onUploadNew }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEmpty = messages.length === 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = () => {
    const q = input.trim()
    if (!q || isAsking) return
    setInput('')
    onAsk(q)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        <AnimatePresence>
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center gap-6 py-12"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-white font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  Ask anything about your PDF
                </p>
                <p className="text-ink-500 text-sm mt-1">
                  Try one of the suggestions below
                </p>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onAsk(s)}
                    disabled={isAsking}
                    className="px-3 py-2 rounded-xl text-sm text-amber-300/80 border border-ink-700
                      hover:border-amber-400/40 hover:bg-amber-400/5 transition-all duration-200 text-left"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-ink-700/50 pt-4">
        <div className="relative flex items-end gap-3 p-3 rounded-2xl bg-ink-900 border border-ink-700
          focus-within:border-amber-400/40 transition-colors duration-200">

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            disabled={isAsking}
            placeholder="Ask a question about your document…"
            rows={1}
            className="flex-1 bg-transparent resize-none text-sm text-white placeholder:text-ink-600
              outline-none py-1 leading-relaxed max-h-[120px]"
            style={{ fontFamily: 'var(--font-body)' }}
          />

          <motion.button
            whileHover={!isAsking && input.trim() ? { scale: 1.05 } : {}}
            whileTap={!isAsking && input.trim() ? { scale: 0.93 } : {}}
            onClick={handleSubmit}
            disabled={isAsking || !input.trim()}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
              transition-all duration-200 disabled:opacity-30"
            style={input.trim() && !isAsking
              ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }
              : { background: '#2e2e42' }
            }
          >
            <Send size={15} className={input.trim() && !isAsking ? 'text-ink-950' : 'text-ink-500'} strokeWidth={2.5} />
          </motion.button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[11px] text-ink-600">
            Press <kbd className="px-1 py-0.5 rounded bg-ink-800 border border-ink-700 font-mono text-[10px]">Enter</kbd> to send,{' '}
            <kbd className="px-1 py-0.5 rounded bg-ink-800 border border-ink-700 font-mono text-[10px]">Shift+Enter</kbd> for new line
          </p>
          <p className="text-[11px] text-ink-600">
            Powered by{' '}
            <span className="text-amber-400/70">Cohere</span>
            {' + '}
            <span className="text-jade-400/70">Groq</span>
          </p>
        </div>
      </div>
    </div>
  )
}
