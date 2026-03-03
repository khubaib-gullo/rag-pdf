# DocMind — PDF RAG Frontend

A beautiful Next.js frontend for the PDF RAG API.

## Setup

```bash
npm install
```

## Configure API URL

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=https://yourname-your-and-deployed-huggingface-space-api-endpoint.hf.space
```

## Run

```bash
npm run dev       # development → http://localhost:3000
npm run build     # production build
npm run start     # production server
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
# Set NEXT_PUBLIC_API_URL in Vercel dashboard → Settings → Environment Variables
```

## Project Structure

```
app/
  layout.tsx       # Root layout + fonts + toaster
  page.tsx         # Main orchestrator (state management)
  globals.css      # Syne + DM Sans fonts, custom styles

components/
  Header.tsx       # Logo + New Session / New PDF buttons
  EmptyState.tsx   # Landing screen with feature cards
  UploadZone.tsx   # Drag & drop PDF uploader
  SessionBadge.tsx # Active session info bar
  ChatPanel.tsx    # Full chat interface with sources

lib/
  api.ts           # Typed API client for all endpoints
```

## Features

- Drag & drop PDF upload with progress indicator
- Real-time chat with animated typing dots
- Expandable source citations per answer (page + preview)
- Suggestion chips for empty chat state
- Session management (create / delete)
- Auto-scrolling message list
- Responsive layout
- Dark theme with amber accent
