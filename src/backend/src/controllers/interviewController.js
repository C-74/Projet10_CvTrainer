import { createInterview, getInterviewById, updateCvData } from '../models/interviewModel.js'
import { extractCvData } from '../services/cvExtractorService.js'
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
