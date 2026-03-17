/**
 * interviewController.js — Contrôleur des entretiens
 * 
 * Gère les opérations liées aux entretiens :
 * - Création d'un nouvel entretien (upload CV + description de poste)
 * - Chat conversationnel avec l'IA (questions/réponses)
 * - Récupération de l'historique des messages
 * - Fin forcée de l'entretien (quand le timer est écoulé)
 */
import { createInterview, getInterviewById, updateCvData } from '../models/interviewModel.js'
import { createMessage, getMessagesByInterviewId } from '../models/messageModel.js'
import { extractCvData } from '../services/cvExtractorService.js'
import { getChatResponse, getForceEndResponse } from '../services/chatService.js'
import path from 'path'

/**
 * Créer un nouvel entretien.
 * 
 * Processus :
 * 1. Valide les données (description de poste + fichier CV obligatoires)
 * 2. Crée l'entretien en base de données
 * 3. Extrait et structure les données du CV via l'IA (en arrière-plan)
 * 4. Retourne l'entretien créé avec les données CV parsées
 * 
 * @route POST /api/interviews
 * @body {string} jobDescription - Description du poste visé
 * @file cv - Fichier PDF du CV (via Multer)
 */
export async function create(req, res) {
  try {
    const jobDescription = req.body.jobDescription
    const cvFilename = req.file?.originalname || null
    const cvPath = req.file?.path || null

    // Validation des champs requis
    if (!jobDescription) {
      return res.status(400).json({ error: 'La description du poste est requise.' })
    }
    if (!cvPath) {
      return res.status(400).json({ error: 'Un CV au format PDF est requis.' })
    }

    // 1. Créer l'entretien en BDD (avec texte CV vide, sera mis à jour après extraction)
    const result = createInterview({
      cvText: '',
      cvFilename,
      jobDescription,
      timerEnabled: false
    })
    const interviewId = result.lastInsertRowid

    // 2. Extraire et structurer les données du CV via le pipeline IA
    // En cas d'erreur d'extraction, l'entretien existe quand même (sans données CV)
    try {
      const { rawText, structured } = await extractCvData(cvPath)
      updateCvData(interviewId, { cvText: rawText, cvData: structured })
    } catch (extractError) {
      console.error('Erreur extraction CV (entretien créé sans données CV):', extractError)
    }

    // 3. Retourner l'entretien avec les données CV parsées en objet JSON
    const interview = getInterviewById(interviewId)
    if (interview.cv_data) {
      interview.cv_data = JSON.parse(interview.cv_data)
    }
    res.status(201).json(interview)
  } catch (error) {
    console.error('Erreur création entretien:', error)
    res.status(500).json({ error: 'Erreur lors de la création de l\'entretien.' })
  }
}

/**
 * Générer des questions via l'IA (placeholder).
 * Non utilisé dans le flux actuel — les questions sont gérées
 * directement par le chat conversationnel.
 * 
 * @route POST /api/interviews/:id/questions
 */
export async function generateQuestions(req, res) {
  // TODO: appeler l'IA pour générer 5-7 questions
  res.json({ message: 'Questions générées' })
}

/**
 * Chat conversationnel avec l'IA.
 * 
 * Deux cas de figure :
 * - Premier appel (sans message, historique vide) : l'IA démarre l'entretien
 *   avec une introduction et une première question
 * - Appels suivants (avec message) : sauvegarde la réponse de l'utilisateur,
 *   envoie l'historique complet à l'IA, et retourne sa réponse
 * 
 * @route POST /api/interviews/:id/chat
 * @body {string} [message] - Message de l'utilisateur (optionnel au 1er appel)
 */
export async function chat(req, res) {
  try {
    const interviewId = req.params.id
    const { message } = req.body

    // Vérifier que l'entretien existe
    const interview = getInterviewById(interviewId)
    if (!interview) {
      return res.status(404).json({ error: 'Entretien non trouvé.' })
    }

    // Préparer le contexte (données CV + description de poste)
    const cvData = interview.cv_data ? JSON.parse(interview.cv_data) : {}
    const jobDescription = interview.job_description

    // Récupérer l'historique de conversation depuis la BDD
    let history = getMessagesByInterviewId(interviewId)

    // Cas 1 : Premier message — l'IA démarre l'entretien
    if (history.length === 0 && !message) {
      const aiResponse = await getChatResponse(cvData, jobDescription, [])
      createMessage(interviewId, 'assistant', aiResponse)
      return res.json({ role: 'assistant', content: aiResponse })
    }

    // Cas 2 : Un message utilisateur est attendu
    if (!message) {
      return res.status(400).json({ error: 'Le message est requis.' })
    }

    // Sauvegarder le message utilisateur en BDD
    createMessage(interviewId, 'user', message)

    // Reconstruire l'historique complet (avec le nouveau message)
    history = getMessagesByInterviewId(interviewId)

    // Obtenir la réponse de l'IA et la sauvegarder
    const aiResponse = await getChatResponse(cvData, jobDescription, history)
    createMessage(interviewId, 'assistant', aiResponse)

    res.json({ role: 'assistant', content: aiResponse })
  } catch (error) {
    console.error('Erreur chat IA:', error)
    res.status(500).json({ error: 'Erreur lors de la communication avec l\'IA.' })
  }
}

/**
 * Récupérer tous les messages d'un entretien.
 * Utilisé pour recharger la conversation lors du retour sur un entretien.
 * 
 * @route GET /api/interviews/:id/messages
 */
export async function getMessages(req, res) {
  try {
    const messages = getMessagesByInterviewId(req.params.id)
    res.json({ messages })
  } catch (error) {
    console.error('Erreur récupération messages:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des messages.' })
  }
}

/**
 * Soumettre une réponse (placeholder).
 * Non utilisé dans le flux actuel — les réponses passent par le chat.
 * 
 * @route POST /api/interviews/:id/answer
 */
export async function submitAnswer(req, res) {
  // TODO: enregistrer la réponse et adapter la difficulté
  res.json({ message: 'Réponse enregistrée' })
}

/**
 * Obtenir le bilan (placeholder).
 * Non utilisé dans le flux actuel — le bilan est généré par l'IA
 * dans le chat via les balises ---BILAN---/---FIN_BILAN---.
 * 
 * @route GET /api/interviews/:id/review
 */
export async function getReview(req, res) {
  // TODO: générer le bilan avec feedback et pistes d'amélioration
  res.json({ message: 'Bilan généré' })
}

/**
 * Forcer la fin de l'entretien (timer écoulé).
 * 
 * Appelé automatiquement par le frontend quand le countdown atteint 0.
 * Envoie une instruction spéciale à l'IA pour qu'elle produise
 * immédiatement le bilan final sans poser de nouvelle question.
 * 
 * @route POST /api/interviews/:id/end
 */
export async function endInterview(req, res) {
  try {
    const interviewId = req.params.id
    const interview = getInterviewById(interviewId)
    if (!interview) {
      return res.status(404).json({ error: 'Entretien non trouvé.' })
    }

    // Préparer le contexte et l'historique
    const cvData = interview.cv_data ? JSON.parse(interview.cv_data) : {}
    const jobDescription = interview.job_description
    const history = getMessagesByInterviewId(interviewId)

    // Demander à l'IA de produire le bilan immédiatement
    const aiResponse = await getForceEndResponse(cvData, jobDescription, history)
    createMessage(interviewId, 'assistant', aiResponse)

    res.json({ role: 'assistant', content: aiResponse })
  } catch (error) {
    console.error('Erreur fin forcée entretien:', error)
    res.status(500).json({ error: 'Erreur lors de la fin forcée de l\'entretien.' })
  }
}
