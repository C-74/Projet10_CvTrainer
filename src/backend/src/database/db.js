/**
 * db.js — Connexion à la base de données SQLite
 * 
 * Crée et configure la connexion à la base de données SQLite
 * stockée dans le dossier data/ du backend. Active :
 * - Mode WAL (Write-Ahead Logging) pour de meilleures performances en lecture/écriture
 * - Clés étrangères pour garantir l'intégrité relationnelle
 */
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

// Résoudre le chemin vers le fichier de base de données
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.resolve(__dirname, '../../data/cv_trainer.db')

// Créer la connexion (crée le fichier automatiquement s'il n'existe pas)
const db = new Database(DB_PATH)

// Optimisations SQLite
db.pragma('journal_mode = WAL')    // WAL = meilleure concurrence en lecture/écriture
db.pragma('foreign_keys = ON')     // Active les contraintes de clés étrangères

export default db
