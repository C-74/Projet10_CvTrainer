import { getAllInterviews, getInterviewById, deleteInterview } from '../models/interviewModel.js'
import { getMessagesByInterviewId } from '../models/messageModel.js'

// Lister tous les entretiens passés
export async function list(req, res) {
  try {
    const interviews = getAllInterviews()
    res.json({ interviews })
  } catch (error) {
    console.error('Erreur récupération historique:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique.' })
  }
}

// Récupérer un entretien par ID (avec messages et CV parsé)
export async function getById(req, res) {
  try {
    const interview = getInterviewById(req.params.id)
    if (!interview) {
      return res.status(404).json({ error: 'Entretien non trouvé.' })
    }
    // Parser cv_data pour le renvoyer en objet
    if (interview.cv_data) {
      interview.cv_data = JSON.parse(interview.cv_data)
    }
    // Joindre les messages de la conversation
    const messages = getMessagesByInterviewId(req.params.id)
    res.json({ interview, messages })
  } catch (error) {
    console.error('Erreur récupération entretien:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'entretien.' })
  }
}

// Supprimer un entretien
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
