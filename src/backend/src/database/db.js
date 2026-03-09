import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.resolve(__dirname, '../../data/cv_trainer.db')

const db = new Database(DB_PATH)

// Activer le mode WAL pour de meilleures performances
db.pragma('journal_mode = WAL')
// Activer les clés étrangères
db.pragma('foreign_keys = ON')

export default db
