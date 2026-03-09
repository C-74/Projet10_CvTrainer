import { createInterview, getInterviewById } from '../models/interviewModel.js'

// Créer un nouvel entretien
export async function create(req, res) {
  try {
    const jobDescription = req.body.jobDescription
    const cvFilename = req.file?.originalname || null

    if (!jobDescription) {
      return res.status(400).json({ error: 'La description du poste est requise.' })
    }

    const result = createInterview({
      cvText: '',  // Sera rempli par l'extraction PDF (OCR) plus tard
      cvFilename,
      jobDescription,
      timerEnabled: false
    })

    const interview = getInterviewById(result.lastInsertRowid)
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
