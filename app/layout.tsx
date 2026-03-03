import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'DocMind — PDF Intelligence',
  description: 'Ask anything about your PDF documents using AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="scanline" />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a24',
              color: '#e8e8f0',
              border: '1px solid #2e2e42',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#0a0a0f' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#0a0a0f' },
            },
          }}
        />
      </body>
    </html>
  )
}
