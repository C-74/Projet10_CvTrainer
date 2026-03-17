/**
 * messageModel.js — Modèle de données pour la table "messages"
 * 
 * Stocke les messages de la conversation entre l'utilisateur et l'IA.
 * Chaque message est lié à un entretien et possède un rôle ('user' ou 'assistant')
 * et un contenu textuel (pouvant contenir des balises [FEEDBACK] et ---BILAN---).
 */
import db from '../database/db.js'

/**
 * Créer un nouveau message dans la conversation d'un entretien.
 * 
 * @param {number} interviewId - ID de l'entretien associé
 * @param {string} role - Rôle de l'auteur ('user' ou 'assistant')
 * @param {string} content - Contenu du message
 * @returns {Object} Résultat de l'insertion
 */
export function createMessage(interviewId, role, content) {
  return db.prepare(
    'INSERT INTO messages (interview_id, role, content) VALUES (?, ?, ?)'
  ).run(interviewId, role, content)
}

/**
 * Récupérer tous les messages d'un entretien, triés par ordre chronologique.
 * Retourne uniquement le rôle et le contenu (pas l'ID ni le timestamp)
 * pour être directement utilisable dans l'historique OpenAI.
 * 
 * @param {number} interviewId - ID de l'entretien
 * @returns {Array<{role: string, content: string}>} Messages triés par ordre d'insertion
 */
export function getMessagesByInterviewId(interviewId) {
  return db.prepare(
    'SELECT role, content FROM messages WHERE interview_id = ? ORDER BY id ASC'
  ).all(interviewId)
}

/**
 * Supprimer tous les messages d'un entretien.
 * 
 * @param {number} interviewId - ID de l'entretien
 */
export function deleteMessagesByInterviewId(interviewId) {
  return db.prepare('DELETE FROM messages WHERE interview_id = ?').run(interviewId)
}
