'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { api, type Message, type SessionInfo } from '@/lib/api'
import { UploadZone } from '@/components/UploadZone'
import { ChatPanel } from '@/components/ChatPanel'
import { SessionBadge } from '@/components/SessionBadge'
import { Header } from '@/components/Header'
import { EmptyState } from '@/components/EmptyState'

export default function Home() {
  const [session, setSession] = useState<SessionInfo | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAsking, setIsAsking] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true)
    try {
      const res = await api.upload(file)
      const sessionInfo: SessionInfo = {
        session_id: res.session_id,
        filename: res.filename,
        total_chunks: res.total_chunks,
        status: 'ready',
      }
      setSession(sessionInfo)
      setMessages([])
      setShowUpload(false)
      toast.success(`"${res.filename}" ready — ${res.total_chunks} chunks indexed`)
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleAsk = useCallback(async (question: string) => {
    if (!session || isAsking) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    }
    const loadingMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    }

    setMessages(prev => [...prev, userMsg, loadingMsg])
    setIsAsking(true)

    try {
      const res = await api.ask(session.session_id, question)
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? {
                ...m,
                content: res.answer,
                sources: res.sources,
                model_used: res.model_used,
                isLoading: false,
              }
            : m
        )
      )
    } catch (err: any) {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? { ...m, content: `Error: ${err.message}`, isLoading: false }
            : m
        )
      )
      toast.error(err.message || 'Query failed')
    } finally {
      setIsAsking(false)
    }
  }, [session, isAsking])

  const handleNewSession = useCallback(async () => {
    if (session) {
      try { await api.deleteSession(session.session_id) } catch {}
    }
    setSession(null)
    setMessages([])
    setShowUpload(true)
  }, [session])

  const hasSession = !!session

  return (
    <div className="min-h-screen bg-ink-950 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(251,191,36,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,191,36,0.025) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient glow blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)' }} />

      {/* Layout */}
      <div className="relative z-10 flex flex-col h-screen max-w-5xl mx-auto px-4">
        <Header
          hasSession={hasSession}
          onNewSession={handleNewSession}
          onUploadClick={() => setShowUpload(true)}
        />

        <main className="flex-1 flex flex-col overflow-hidden pb-4 gap-3">
          {/* Session badge */}
          <AnimatePresence>
            {session && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <SessionBadge session={session} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {!hasSession && !showUpload && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <EmptyState onGetStarted={() => setShowUpload(true)} />
                </motion.div>
              )}

              {(showUpload || (!hasSession && showUpload)) && !hasSession && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="h-full flex items-center justify-center"
                >
                  <UploadZone
                    onUpload={handleUpload}
                    isUploading={isUploading}
                    onCancel={() => setShowUpload(false)}
                  />
                </motion.div>
              )}

              {hasSession && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <ChatPanel
                    messages={messages}
                    onAsk={handleAsk}
                    isAsking={isAsking}
                    onUploadNew={() => setShowUpload(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Upload modal overlay when session exists */}
      <AnimatePresence>
        {showUpload && hasSession && (
          <motion.div
            key="upload-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl"
            >
              <UploadZone
                onUpload={handleUpload}
                isUploading={isUploading}
                onCancel={() => setShowUpload(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
