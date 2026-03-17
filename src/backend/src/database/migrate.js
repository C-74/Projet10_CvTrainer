/**
 * migrate.js — Script de migration de la base de données
 * 
 * Crée les tables nécessaires au fonctionnement de l'application.
 * Utilise CREATE TABLE IF NOT EXISTS pour être idempotent (peut être relancé sans risque).
 * 
 * Tables créées :
 * - interviews : Entretiens (CV, description de poste, statut)
 * - questions  : Questions générées par l'IA
 * - answers    : Réponses du candidat aux questions
 * - reviews    : Bilans finaux des entretiens
 * - messages   : Messages bruts de la conversation (utilisé par le flux chat)
 * 
 * Usage : npm run db:migrate
 */
import db from './db.js'

// Création de toutes les tables en une seule transaction implicite
db.exec(`
  -- Table principale des entretiens
  CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cv_text TEXT NOT NULL,           -- Texte brut extrait du PDF
    cv_data TEXT,                     -- Données structurées du CV (JSON string)
    cv_filename TEXT,                 -- Nom original du fichier PDF uploadé
    job_description TEXT NOT NULL,    -- Description du poste visé
    timer_enabled INTEGER DEFAULT 0, -- 1 = timer activé, 0 = désactivé
    status TEXT DEFAULT 'pending',   -- Statut : pending, in_progress, completed
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Questions générées par l'IA pour chaque entretien
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    interview_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    difficulty TEXT DEFAULT 'medium',  -- easy, medium, hard
    order_index INTEGER NOT NULL,     -- Ordre d'affichage
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
  );

  -- Réponses du candidat (liées aux questions)
  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    answer_text TEXT NOT NULL,
    feedback TEXT,                     -- Feedback IA sur la réponse
    suggested_answer TEXT,            -- Réponse idéale suggérée par l'IA
    score INTEGER,                    -- Score de la réponse (1-10)
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
  );

  -- Bilan final de chaque entretien
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    interview_id INTEGER NOT NULL UNIQUE,  -- Un seul bilan par entretien
    global_feedback TEXT,
    improvement_tips TEXT,
    overall_score INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
  );

  -- Messages bruts de la conversation (flux chat principal)
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    interview_id INTEGER NOT NULL,
    role TEXT NOT NULL,               -- 'user' ou 'assistant'
    content TEXT NOT NULL,            -- Contenu brut (avec balises FEEDBACK/BILAN)
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
  );
`)

console.log('Migration terminée avec succès.')
