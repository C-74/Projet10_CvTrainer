import db from './db.js'

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cv_text TEXT NOT NULL,
    cv_filename TEXT,
    job_description TEXT NOT NULL,
    timer_enabled INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    interview_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    difficulty TEXT DEFAULT 'medium',
    order_index INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    answer_text TEXT NOT NULL,
    feedback TEXT,
    suggested_answer TEXT,
    score INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    interview_id INTEGER NOT NULL UNIQUE,
    global_feedback TEXT,
    improvement_tips TEXT,
    overall_score INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
  );
`)

console.log('Migration terminée avec succès.')
