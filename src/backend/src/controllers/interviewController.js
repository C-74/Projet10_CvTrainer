import { createInterview, getInterviewById, updateCvData } from '../models/interviewModel.js'
import { createMessage, getMessagesByInterviewId } from '../models/messageModel.js'
import { extractCvData } from '../services/cvExtractorService.js'
import { getChatResponse, getForceEndResponse } from '../services/chatService.js'
import path from 'path'

// Créer un nouvel entretien
export async function create(req, res) {
  try {
    const jobDescription = req.body.jobDescription
    const cvFilename = req.file?.originalname || null
    const cvPath = req.file?.path || null

    if (!jobDescription) {
      return res.status(400).json({ error: 'La description du poste est requise.' })
    }
    if (!cvPath) {
      return res.status(400).json({ error: 'Un CV au format PDF est requis.' })
    }

    // 1. Créer l'entretien en BDD (avec texte vide pour l'instant)
    const result = createInterview({
      cvText: '',
      cvFilename,
      jobDescription,
      timerEnabled: false
    })
    const interviewId = result.lastInsertRowid

    // 2. Extraire et structurer les données du CV
    try {
      const { rawText, structured } = await extractCvData(cvPath)
      updateCvData(interviewId, { cvText: rawText, cvData: structured })
    } catch (extractError) {
      console.error('Erreur extraction CV (entretien créé sans données CV):', extractError)
    }

    const interview = getInterviewById(interviewId)
    // Parser cv_data pour le renvoyer en objet
    if (interview.cv_data) {
      interview.cv_data = JSON.parse(interview.cv_data)
    }
    res.status(201).json(interview)
  } catch (error) {
    console.error('Erreur création entretien:', error)
    res.status(500).json({ error: 'Erreur lors de la création de l\'entretien.' })
  }
}

// Générer les questions via l'IA
export async function generateQuestions(req, res) {
  // TODO: appeler l'IA pour générer 5-7 questions
  res.json({ message: 'Questions générées' })
}

// Chat avec l'IA
export async function chat(req, res) {
  try {
    const interviewId = req.params.id
    const { message } = req.body

    const interview = getInterviewById(interviewId)
    if (!interview) {
      return res.status(404).json({ error: 'Entretien non trouvé.' })
    }

    const cvData = interview.cv_data ? JSON.parse(interview.cv_data) : {}
    const jobDescription = interview.job_description

    // Récupérer l'historique de conversation
    let history = getMessagesByInterviewId(interviewId)

    // Si c'est le premier message (pas d'historique), démarrer l'entretien
    if (history.length === 0 && !message) {
      const aiResponse = await getChatResponse(cvData, jobDescription, [])
      createMessage(interviewId, 'assistant', aiResponse)
      return res.json({ role: 'assistant', content: aiResponse })
    }

    if (!message) {
      return res.status(400).json({ error: 'Le message est requis.' })
    }

    // Sauvegarder le message utilisateur
    createMessage(interviewId, 'user', message)

    // Reconstruire l'historique avec le nouveau message
    history = getMessagesByInterviewId(interviewId)

    // Obtenir la réponse de l'IA
    const aiResponse = await getChatResponse(cvData, jobDescription, history)
    createMessage(interviewId, 'assistant', aiResponse)

    res.json({ role: 'assistant', content: aiResponse })
  } catch (error) {
    console.error('Erreur chat IA:', error)
    res.status(500).json({ error: 'Erreur lors de la communication avec l\'IA.' })
  }
}

// Récupérer l'historique des messages
export async function getMessages(req, res) {
  try {
    const messages = getMessagesByInterviewId(req.params.id)
    res.json({ messages })
  } catch (error) {
    console.error('Erreur récupération messages:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des messages.' })
  }
}

// Soumettre une réponse
export async function submitAnswer(req, res) {
  // TODO: enregistrer la réponse et adapter la difficulté
  res.json({ message: 'Réponse enregistrée' })
}

// Obtenir le bilan
export async function getReview(req, res) {
  // TODO: générer le bilan avec feedback et pistes d'amélioration
  res.json({ message: 'Bilan généré' })
}

// Forcer la fin de l'entretien (timer écoulé)
export async function endInterview(req, res) {
  try {
    const interviewId = req.params.id
    const interview = getInterviewById(interviewId)
    if (!interview) {
      return res.status(404).json({ error: 'Entretien non trouvé.' })
    }

    const cvData = interview.cv_data ? JSON.parse(interview.cv_data) : {}
    const jobDescription = interview.job_description
    const history = getMessagesByInterviewId(interviewId)

    const aiResponse = await getForceEndResponse(cvData, jobDescription, history)
    createMessage(interviewId, 'assistant', aiResponse)

    res.json({ role: 'assistant', content: aiResponse })
  } catch (error) {
    console.error('Erreur fin forcée entretien:', error)
    res.status(500).json({ error: 'Erreur lors de la fin forcée de l\'entretien.' })
  }
}
