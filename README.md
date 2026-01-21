# Guestbook: Infinite Pink Edition 📘

A beautiful, real-time guestbook with infinite pages and database persistence.

## Features

- 🎨 Pink Edition design with page flip animations
- 📝 Click-to-write on any empty line
- ♾️ Auto-scaling pages (infinite book)
- 🔄 Real-time sync across all users
- 💾 Neon PostgreSQL database storage
- ⌨️ Arrow key navigation

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure database:**
   Edit `.env` and set your `DATABASE_URL`:
   ```
   DATABASE_URL="postgres://user:pass@host/db?sslmode=require"
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## Deployment

### Render / Railway / Heroku

1. Push to GitHub
2. Connect your repo
3. Set `DATABASE_URL` environment variable
4. Deploy!

### Vercel (Frontend) + Render (API)

For serverless deployment, split the frontend and backend.

## Tech Stack

- **Frontend:** Vanilla JS, PageFlip.js
- **Backend:** Node.js, Express, Socket.IO
- **Database:** PostgreSQL (Neon-optimized)

## License

MIT
