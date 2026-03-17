/**
 * historyController.js — Contrôleur de l'historique des entretiens
 * 
 * Gère les opérations CRUD sur l'historique :
 * - Lister tous les entretiens passés
 * - Récupérer le détail d'un entretien (avec messages et CV parsé)
 * - Supprimer un entretien
 */
import { getAllInterviews, getInterviewById, deleteInterview } from '../models/interviewModel.js'
import { getMessagesByInterviewId } from '../models/messageModel.js'

/**
 * Lister tous les entretiens passés.
 * Retourne un tableau d'entretiens triés par date de création (les plus récents en premier).
 * 
 * @route GET /api/history
 */
export async function list(req, res) {
  try {
    const interviews = getAllInterviews()
    res.json({ interviews })
  } catch (error) {
    console.error('Erreur récupération historique:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique.' })
  }
}

/**
 * Récupérer un entretien par son ID, enrichi avec ses messages et son CV parsé.
 * Utilisé pour recharger un entretien complet depuis l'historique.
 * 
 * @route GET /api/history/:id
 * @returns {{ interview: Object, messages: Array }} Entretien + messages associés
 */
export async function getById(req, res) {
  try {
    const interview = getInterviewById(req.params.id)
    if (!interview) {
      return res.status(404).json({ error: 'Entretien non trouvé.' })
    }
    // Parser cv_data (stocké en JSON string) pour le renvoyer en objet
    if (interview.cv_data) {
      interview.cv_data = JSON.parse(interview.cv_data)
    }
    // Joindre les messages de la conversation pour affichage complet
    const messages = getMessagesByInterviewId(req.params.id)
    res.json({ interview, messages })
  } catch (error) {
    console.error('Erreur récupération entretien:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'entretien.' })
  }
}

/**
 * Supprimer un entretien de l'historique.
 * Supprime l'entretien et ses données associées (messages, questions, réponses)
 * grâce aux ON DELETE CASCADE configurés dans le schéma SQL.
 * 
 * @route DELETE /api/history/:id
 */
export async function remove(req, res) {
  try {
    const id = req.params.id
    const interview = getInterviewById(id)
    if (!interview) {
      return res.status(404).json({ error: 'Entretien non trouvé.' })
    }
    deleteInterview(id)
    res.json({ message: 'Entretien supprimé.' })
  } catch (error) {
    console.error('Erreur suppression entretien:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression.' })
  }
}
