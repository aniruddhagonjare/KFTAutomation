import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ───────────────────────────────────────────────────────────────────
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'kft-automation-secret-key-2024-change-in-prod';
const JWT_EXPIRES_IN = '8h';
const JWT_COOKIE_NAME = 'kft_session';
const IS_PROD = process.env.NODE_ENV === 'production';

const PKG_PATH = path.resolve(__dirname, '../../package.json');
const USERS_PATH = path.resolve(__dirname, './users.json');

// ─── Express + Socket.io setup ────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true, methods: ['GET', 'POST'] }
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,  // Required for cookies to be accepted cross-origin
}));
app.use(express.json());
app.use(cookieParser());

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function loadUsers() {
  const raw = await fs.readFile(USERS_PATH, 'utf-8');
  return JSON.parse(raw).users;
}

async function getScripts() {
  const data = await fs.readFile(PKG_PATH, 'utf-8');
  const pkg = JSON.parse(data);
  const scripts = pkg.scripts || {};
  return Object.entries(scripts).map(([name, command]) => {
    let category = 'Misc';
    if (name.includes('playwright') || name.includes('test') || name.includes('Happy')) category = 'Web UI';
    if (name.includes('mobile') || name.includes('ios')) category = 'Mobile';
    if (name.includes('loadtest')) category = 'Performance';
    if (name.includes('mock') || name.includes('server')) category = 'Utilities';
    return { name, command, category };
  });
}

// Decode the Base64-encoded credential payload sent by the frontend
function decodeCredentials(encoded) {
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Strip any sensitive fields before sending user profile
function sanitizeUser(user) {
  const { passwordHash, password, ...safe } = user;
  return safe;
}

// ─── JWT Helpers ───────────────────────────────────────────────────────────────
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function setAuthCookie(res, token) {
  res.cookie(JWT_COOKIE_NAME, token, {
    httpOnly: true,        // JS cannot read this cookie — prevents XSS token theft
    secure: IS_PROD,       // HTTPS only in production
    sameSite: 'strict',    // CSRF protection
    maxAge: 8 * 60 * 60 * 1000, // 8 hours in ms
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie(JWT_COOKIE_NAME, { path: '/' });
}

// ─── JWT Middleware ────────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  // Check HttpOnly cookie first (primary method)
  const cookieToken = req.cookies?.[JWT_COOKIE_NAME];
  // Fallback: Bearer header (used only by Socket.io handshake)
  const headerToken = req.headers['authorization']?.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No session.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    clearAuthCookie(res);
    return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin role required.' });
  }
  next();
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 *
 * Expects body: { payload: "<base64-encoded JSON of {username, password}>" }
 * Sets JWT as an HttpOnly cookie. NEVER returns the token in the response body.
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { payload } = req.body;

    if (!payload) {
      return res.status(400).json({ success: false, message: 'Invalid request format.' });
    }

    // Decode Base64 credentials
    const credentials = decodeCredentials(payload);
    if (!credentials?.username || !credentials?.password) {
      return res.status(400).json({ success: false, message: 'Malformed credential payload.' });
    }

    const { username, password } = credentials;

    // Load whitelist
    const users = await loadUsers();
    const user = users.find(
      u => u.username === username || u.email === username
    );

    // Constant-time comparison via bcrypt (prevents timing attacks)
    const dummyHash = '$2b$12$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const isValid = user
      ? await bcrypt.compare(password, user.passwordHash || dummyHash)
      : (await bcrypt.compare(password, dummyHash), false); // Still run bcrypt on miss

    if (!user || !isValid) {
      console.warn(`⚠ Failed login attempt for: ${username}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials. Access denied.' });
    }

    // Sign token
    const safeUser = sanitizeUser(user);
    const token = signToken(safeUser);

    // Set JWT as HttpOnly cookie — NOT in response body
    setAuthCookie(res, token);

    console.log(`✓ Login: ${user.name} (${user.role})`);

    // Response contains ONLY the user profile, never the token
    return res.json({
      success: true,
      message: `Welcome, ${user.name}!`,
      data: { user: safeUser }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * GET /api/auth/me
 * Validates the cookie and returns the user profile. Used on page refresh.
 */
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

/**
 * POST /api/auth/logout
 * Clears the HttpOnly session cookie.
 */
app.post('/api/auth/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Signed out successfully.' });
});

// ─── Protected API Routes ─────────────────────────────────────────────────────

app.get('/api/scripts', requireAuth, async (req, res) => {
  try {
    const scripts = await getScripts();
    res.json({ success: true, data: scripts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── Env Variable Manager (Admin only) ───────────────────────────────────────
const ENV_PATH = path.resolve(__dirname, '../../.env');

// Parse .env into an array of { key, value, comment } preserving order
async function readEnvFile() {
  const raw = await fs.readFile(ENV_PATH, 'utf-8').catch(() => '');
  return raw.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return { idx, type: 'comment', raw: line };
    const eqPos = trimmed.indexOf('=');
    if (eqPos === -1) return { idx, type: 'comment', raw: line };
    const key = trimmed.slice(0, eqPos).trim();
    const rawVal = trimmed.slice(eqPos + 1).trim();
    // Strip surrounding quotes if any
    const value = rawVal.replace(/^['"]|['"]$/g, '');
    return { idx, type: 'entry', key, value, raw: line };
  });
}

async function writeEnvFile(entries) {
  const lines = entries.map(e => {
    if (e.type !== 'entry') return e.raw;
    // Preserve spacing style: if value contains spaces or special chars, quote it
    const needsQuote = /\s|'/.test(e.value);
    return `${e.key}=${needsQuote ? `'${e.value}'` : e.value}`;
  });
  await fs.writeFile(ENV_PATH, lines.join('\n'));
}

/**
 * GET /api/env — Returns all env key-value pairs (admin only)
 */
app.get('/api/env', requireAuth, requireAdmin, async (req, res) => {
  try {
    const entries = await readEnvFile();
    const vars = entries
      .filter(e => e.type === 'entry')
      .map(({ key, value }) => ({ key, value }));
    res.json({ success: true, data: vars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * PATCH /api/env — Update one or more env variables (admin only)
 * Body: { updates: { KEY: "newValue", ... } }
 */
app.patch('/api/env', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { updates } = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid updates payload.' });
    }

    const entries = await readEnvFile();
    const updatedKeys = [];

    // Update existing keys
    entries.forEach(entry => {
      if (entry.type === 'entry' && updates.hasOwnProperty(entry.key)) {
        entry.value = updates[entry.key];
        updatedKeys.push(entry.key);
      }
    });

    // Append any brand-new keys that weren't in the file
    for (const [key, value] of Object.entries(updates)) {
      if (!updatedKeys.includes(key)) {
        entries.push({ type: 'entry', key, value, raw: '' });
        updatedKeys.push(key);
      }
    }

    await writeEnvFile(entries);
    console.log(`✓ Env updated by ${req.user.name}: ${updatedKeys.join(', ')}`);
    res.json({ success: true, message: `Updated: ${updatedKeys.join(', ')}`, data: updatedKeys });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ─── Socket.io — auth via cookie token ────────────────────────────────────────
let currentProcess = null;

io.use((socket, next) => {
  // Socket.io reads the cookie from the handshake headers
  const rawCookies = socket.handshake.headers?.cookie || '';
  const cookieMap = Object.fromEntries(
    rawCookies.split(';').map(c => c.trim().split('=').map(decodeURIComponent))
  );
  const token = cookieMap[JWT_COOKIE_NAME];

  if (!token) return next(new Error('UNAUTHORIZED'));
  try {
    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return next(new Error('UNAUTHORIZED'));
  }
});

io.on('connection', (socket) => {
  console.log(`✓ Socket: ${socket.user?.name} (${socket.user?.role})`);

  socket.on('run-script', async ({ name }) => {
    if (socket.user?.role !== 'admin') {
      socket.emit('error-msg', { message: 'Permission denied: Only admins can run scripts.' });
      return;
    }
    if (currentProcess) {
      socket.emit('error-msg', { message: 'A process is already running. Please wait.' });
      return;
    }

    console.log(`▶ ${socket.user.name} running: ${name}`);
    currentProcess = spawn('npm', ['run', name], {
      shell: true,
      cwd: path.resolve(__dirname, '../../')
    });

    socket.emit('status', { status: 'running', script: name });
    currentProcess.stdout.on('data', (data) => socket.emit('log', data.toString()));
    currentProcess.stderr.on('data', (data) => socket.emit('log', data.toString()));
    currentProcess.on('close', (code) => {
      socket.emit('status', { status: 'idle', exitCode: code });
      currentProcess = null;
    });
  });

  socket.on('stop-script', () => {
    if (socket.user?.role !== 'admin') return;
    if (currentProcess) {
      currentProcess.kill();
      socket.emit('log', '\n[System] Process terminated by user.\n');
      currentProcess = null;
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Shell: Interactive Web Terminal (Admin only, child_process based)
  // ──────────────────────────────────────────────────────────────────────────
  let shellProcess = null;

  socket.on('pty:start', () => {
    if (socket.user?.role !== 'admin') {
      socket.emit('pty:output', '\r\n\x1b[31m[Access Denied] Interactive terminal requires admin role.\x1b[0m\r\n');
      return;
    }
    if (shellProcess) {
      socket.emit('pty:output', '\r\n\x1b[33m[System] Session already active.\x1b[0m\r\n');
      return;
    }

    const shell = process.platform === 'darwin' ? 'zsh' : 'bash';
    shellProcess = spawn(shell, ['--login'], {
      shell: false,
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: path.resolve(__dirname, '../../'),
      env: { ...process.env, TERM: 'xterm-256color', PATH: process.env.PATH + ':/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin' }
    });

    console.log(`▶ Shell started for ${socket.user.name} (PID: ${shellProcess.pid})`);

    const emit = (data) => socket.emit('pty:output', data.toString());
    shellProcess.stdout.on('data', emit);
    shellProcess.stderr.on('data', emit);

    shellProcess.on('close', (code) => {
      console.log(`■ Shell closed (${code}) for ${socket.user?.name}`);
      socket.emit('pty:output', `\r\n\x1b[90m[Shell session ended]\x1b[0m\r\n`);
      socket.emit('pty:exit', { exitCode: code });
      shellProcess = null;
    });
  });

  socket.on('pty:input', (data) => {
    if (shellProcess?.stdin?.writable) {
      shellProcess.stdin.write(data.replace(/\r/g, '\n'));
    }
  });

  // resize is a no-op without a real PTY but we still accept the event
  socket.on('pty:resize', () => {});

  socket.on('pty:stop', () => {
    if (shellProcess) {
      shellProcess.kill();
      shellProcess = null;
    }
  });

  socket.on('disconnect', () => {
    console.log(`✗ Socket: ${socket.user?.name} disconnected`);
    if (shellProcess) { shellProcess.kill(); shellProcess = null; }
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 KFT Automation Server: http://localhost:${PORT}`);
  console.log('🔐 Auth: JWT via HttpOnly Cookie (8h session)');
  console.log('🛡  Credentials: Base64 encoded request ➜ bcrypt verified');
  console.log(`👥 Whitelist: ${USERS_PATH}\n`);
});
