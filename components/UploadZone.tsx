'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, Loader2, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

interface UploadZoneProps {
  onUpload: (file: File) => void
  isUploading: boolean
  onCancel: () => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadZone({ onUpload, isUploading, onCancel }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setSelectedFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isUploading,
  })

  const handleSubmit = () => {
    if (selectedFile && !isUploading) onUpload(selectedFile)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Card */}
      <div className="rounded-2xl border border-ink-700 bg-ink-900/80 overflow-hidden"
        style={{ backdropFilter: 'blur(20px)' }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-700/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Upload PDF
            </span>
          </div>
          {!isUploading && (
            <button onClick={onCancel}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-500
                hover:text-white hover:bg-ink-700 transition-all">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            {...getRootProps()}
            className={clsx(
              'relative rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200',
              isDragActive
                ? 'border-amber-400/70 bg-amber-400/5 dropzone-active'
                : 'border-ink-600 hover:border-amber-400/40 hover:bg-ink-800/50',
              isUploading && 'pointer-events-none opacity-60'
            )}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {isDragActive ? (
                <motion.div
                  key="drag"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/15 flex items-center justify-center">
                    <Upload size={26} className="text-amber-300" />
                  </div>
                  <p className="text-amber-300 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                    Drop it here!
                  </p>
                </motion.div>
              ) : selectedFile ? (
                <motion.div
                  key="file"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-jade-500/15 flex items-center justify-center">
                    <FileText size={26} className="text-jade-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-ink-500 mt-0.5">{formatSize(selectedFile.size)}</p>
                  </div>
                  {!isUploading && (
                    <p className="text-xs text-ink-500">Click to change file</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-14 h-14 rounded-2xl bg-ink-700/60 flex items-center justify-center"
                  >
                    <Upload size={26} className="text-ink-500" />
                  </motion.div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      Drag & drop your PDF here
                    </p>
                    <p className="text-ink-500 text-xs mt-1">
                      or <span className="text-amber-300 underline underline-offset-2">browse files</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-600">
                    <span className="px-2 py-0.5 rounded bg-ink-800 border border-ink-700">PDF only</span>
                    <span className="px-2 py-0.5 rounded bg-ink-800 border border-ink-700">Max 50 MB</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upload button */}
          <AnimatePresence>
            {selectedFile && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                whileHover={!isUploading ? { scale: 1.01 } : {}}
                whileTap={!isUploading ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full py-3.5 rounded-xl font-semibold text-ink-950 flex items-center
                  justify-center gap-2 transition-all duration-200 disabled:opacity-80"
                style={{
                  background: isUploading
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Processing PDF...
                  </>
                ) : (
                  <>
                    <CheckCircle size={17} strokeWidth={2.5} />
                    Analyse Document
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Progress bar while uploading */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="h-1 rounded-full bg-ink-700 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #fbbf24, #34d399, #fbbf24)', backgroundSize: '200% 100%' }}
                    animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-ink-600">
                  <span>Extracting text & building index…</span>
                  <span className="text-amber-400">Cohere + FAISS</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
