/**
 * interviewModel.js — Modèle de données pour la table "interviews"
 * 
 * Fournit les opérations CRUD sur les entretiens stockés en SQLite.
 * Chaque entretien contient le texte brut du CV, les données structurées (JSON),
 * le nom du fichier CV, la description du poste, et l'état du timer.
 */
import db from '../database/db.js'

/**
 * Créer un nouvel entretien en base de données.
 * 
 * @param {Object} params
 * @param {string} params.cvText - Texte brut extrait du PDF
 * @param {string} params.cvFilename - Nom original du fichier CV
 * @param {string} params.jobDescription - Description du poste visé
 * @param {boolean} params.timerEnabled - Si le mode timer est activé
 * @returns {Object} Résultat de l'insertion (lastInsertRowid = ID de l'entretien)
 */
export function createInterview({ cvText, cvFilename, jobDescription, timerEnabled }) {
  const stmt = db.prepare(`
    INSERT INTO interviews (cv_text, cv_filename, job_description, timer_enabled)
    VALUES (?, ?, ?, ?)
  `)
  return stmt.run(cvText, cvFilename, jobDescription, timerEnabled ? 1 : 0)
}

/**
 * Récupérer un entretien par son ID.
 * @param {number} id - ID de l'entretien
 * @returns {Object|undefined} L'entretien trouvé ou undefined
 */
export function getInterviewById(id) {
  return db.prepare('SELECT * FROM interviews WHERE id = ?').get(id)
}

/**
 * Récupérer tous les entretiens, triés par date de création décroissante.
 * @returns {Array<Object>} Liste de tous les entretiens
 */
export function getAllInterviews() {
  return db.prepare('SELECT * FROM interviews ORDER BY created_at DESC').all()
}

/**
 * Mettre à jour le statut d'un entretien (ex: 'pending' → 'completed').
 * @param {number} id - ID de l'entretien
 * @param {string} status - Nouveau statut
 */
export function updateInterviewStatus(id, status) {
  return db.prepare('UPDATE interviews SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').run(status, id)
}

/**
 * Mettre à jour les données CV d'un entretien (après extraction IA).
 * @param {number} id - ID de l'entretien
 * @param {Object} params
 * @param {string} params.cvText - Texte brut mis à jour
 * @param {Object} params.cvData - Données structurées du CV (sera stringifié en JSON)
 */
export function updateCvData(id, { cvText, cvData }) {
  return db.prepare(`
    UPDATE interviews SET cv_text = ?, cv_data = ?, updated_at = datetime('now') WHERE id = ?
  `).run(cvText, JSON.stringify(cvData), id)
}

/**
 * Supprimer un entretien et toutes ses données associées.
 * Supprime dans l'ordre : messages, réponses, questions, reviews, puis l'entretien.
 * 
 * @param {number} id - ID de l'entretien à supprimer
 */
export function deleteInterview(id) {
  // Suppression en cascade manuelle pour garantir la propreté des données
  db.prepare('DELETE FROM messages WHERE interview_id = ?').run(id)
  db.prepare('DELETE FROM answers WHERE question_id IN (SELECT id FROM questions WHERE interview_id = ?)').run(id)
  db.prepare('DELETE FROM questions WHERE interview_id = ?').run(id)
  db.prepare('DELETE FROM reviews WHERE interview_id = ?').run(id)
  return db.prepare('DELETE FROM interviews WHERE id = ?').run(id)
}
