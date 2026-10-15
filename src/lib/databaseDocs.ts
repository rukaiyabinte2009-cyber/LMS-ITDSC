export const DATABASE_CONNECTION_GUIDE = {
  architectureSummary: `In this architecture, your Node.js Express backend connects directly to PostgreSQL running on the same cPanel server using the official 'pg' library (Pool-based connection). Because PostgreSQL is hosted locally on the same machine (localhost:5432), latency is sub-millisecond, and you do NOT need complex external VPCs or third-party paid database hosts.`,
  
  steps: [
    {
      step: 1,
      title: 'Create the Database and User in cPanel',
      details: 'Go to cPanel > PostgreSQL Databases. Create database "learn" (which becomes "itdatasc_learn"). Create user "learnuser" (which becomes "itdatasc_learnuser") with a strong password. Add the user to the database with ALL PRIVILEGES.'
    },
    {
      step: 2,
      title: 'Run 001_init.sql in phpPgAdmin',
      details: 'Open phpPgAdmin from cPanel, select your database (itdatasc_learn), go to the SQL tab, and paste the schema provided below. This creates all 13 required relational tables.'
    },
    {
      step: 3,
      title: 'Set DATABASE_URL in cPanel Node.js App Screen',
      details: 'In Setup Node.js App > Environment Variables, add DATABASE_URL. Format: postgres://<user>:<password>@localhost:5432/<dbname>. Note: If your password has special characters like @, #, or %, URL-encode them (e.g. # becomes %23).'
    },
    {
      step: 4,
      title: 'Connection Pool in Node.js (pg.Pool)',
      details: 'Your server uses a connection pool with max: 10 connections. On shared hosting, keeping the pool small (5 to 10 connections) prevents exceeding CloudLinux process/memory limits.'
    }
  ],

  dbTsCode: `// server/src/db.ts
import { Pool } from 'pg';
import { config } from './config.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Standard localhost connection inside cPanel doesn't require SSL
  max: 10,    // Shared hosting friendly: small connection pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Helper for parameterized queries
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    console.log('Executed query', { text: text.slice(0, 60), duration, rows: res.rowCount });
  }
  return res.rows;
}

// Single-row query helper
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}`,

  envTemplate: `# cPanel Environment Variables (Enter in "Setup Node.js App" UI)
NODE_ENV=production
DATABASE_URL=postgres://itdatasc_learnuser:YOUR_STRONG_PASSWORD@localhost:5432/itdatasc_learn
SESSION_SECRET=c8f8b89e278a9c301d4a6efb20c91834f828a49c67
APP_URL=https://learn.itdatascience.com
UPLOAD_DIR=/home/itdatasc/learn_uploads
MAX_UPLOAD_MB=10
PAYMENT_BKASH_NUMBER=01712345678
PAYMENT_NAGAD_NUMBER=01998765432
PAYMENT_ROCKET_NUMBER=017123456789`,

  schemaSql: `-- 001_init.sql: PostgreSQL schema for learn.itdatascience.com
CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS courses (
  id           BIGSERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  summary      TEXT,
  description  TEXT,
  level        TEXT DEFAULT 'beginner',
  price_bdt    INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
  id        BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title     TEXT NOT NULL,
  position  INTEGER NOT NULL,
  UNIQUE (course_id, position)
);

CREATE TABLE IF NOT EXISTS lessons (
  id              BIGSERIAL PRIMARY KEY,
  module_id       BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  position        INTEGER NOT NULL,
  youtube_id      TEXT,
  duration_min    INTEGER,
  notes_md        TEXT,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (module_id, position)
);

CREATE TABLE IF NOT EXISTS live_sessions (
  id                 BIGSERIAL PRIMARY KEY,
  course_id          BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title              TEXT NOT NULL,
  starts_at          TIMESTAMPTZ NOT NULL,
  duration_min       INTEGER NOT NULL DEFAULT 60,
  meet_url           TEXT NOT NULL,
  passcode           TEXT,
  meeting_id         TEXT,
  language           TEXT NOT NULL DEFAULT 'bn' CHECK (language IN ('bn','en','mixed')),
  recording_youtube_id TEXT,
  notes              TEXT
);

CREATE TABLE IF NOT EXISTS assignments (
  id              BIGSERIAL PRIMARY KEY,
  module_id       BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  instructions_md TEXT NOT NULL,
  max_score       INTEGER NOT NULL DEFAULT 100,
  pass_score      INTEGER NOT NULL DEFAULT 50,
  due_at          TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS enrollments (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id   BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','rejected','revoked')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  approved_by BIGINT REFERENCES users(id),
  UNIQUE (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS payments (
  id            BIGSERIAL PRIMARY KEY,
  enrollment_id BIGINT NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  method        TEXT NOT NULL CHECK (method IN ('bkash','nagad','rocket')),
  amount_bdt    INTEGER NOT NULL,
  sender_number TEXT NOT NULL,
  trx_id        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','verified','rejected')),
  admin_note    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at   TIMESTAMPTZ,
  UNIQUE (method, trx_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id    BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id            BIGSERIAL PRIMARY KEY,
  assignment_id BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attempt       INTEGER NOT NULL DEFAULT 1,
  file_path     TEXT NOT NULL,
  original_name TEXT NOT NULL,
  size_bytes    BIGINT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','graded','resubmit_requested')),
  score         INTEGER,
  feedback      TEXT,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  graded_at     TIMESTAMPTZ,
  UNIQUE (assignment_id, user_id, attempt)
);

CREATE TABLE IF NOT EXISTS certificates (
  id        BIGSERIAL PRIMARY KEY,
  user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  code      TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);`
};
