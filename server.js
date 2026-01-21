require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const compression = require('compression');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;

// --- DATABASE POOL (Neon Optimized) ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

// --- DB INIT ---
async function initDB() {
    try {
        const client = await pool.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS entries (
                id SERIAL PRIMARY KEY,
                line_index INTEGER UNIQUE,
                text TEXT,
                name TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Database initialized');
        client.release();
    } catch (err) {
        console.error('❌ Database init error:', err.message);
    }
}
initDB();

// --- MIDDLEWARE ---
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API ROUTES ---
app.get('/entries', async (req, res) => {
    try {
        const result = await pool.query('SELECT line_index, text, name FROM entries ORDER BY line_index ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching entries:', err.message);
        res.json([]);
    }
});

// --- SOCKET.IO ---
io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    socket.on('write_entry', async (data) => {
        const { text, name, line_index } = data;
        try {
            await pool.query(
                'INSERT INTO entries (line_index, text, name) VALUES ($1, $2, $3) ON CONFLICT (line_index) DO UPDATE SET text = $2, name = $3',
                [line_index, text, name]
            );
            // Broadcast to all clients
            io.emit('new_entry', { text, name, line_index });
            console.log(`📝 Entry saved: "${text}" by ${name} at line ${line_index}`);
        } catch (err) {
            console.error('Error saving entry:', err.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('👋 User disconnected:', socket.id);
    });
});

// --- START SERVER ---
server.listen(PORT, () => {
    console.log(`🚀 Guestbook server running on http://localhost:${PORT}`);
});
