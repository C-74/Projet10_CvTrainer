import { Router } from 'express'
import * as interviewController from '../controllers/interviewController.js'
import { upload } from '../middlewares/upload.js'

const router = Router()

// Créer un entretien (upload CV + description de poste)
router.post('/', upload.single('cv'), interviewController.create)

// Chat avec l'IA
router.post('/:id/chat', interviewController.chat)

// Récupérer les messages d'un entretien
router.get('/:id/messages', interviewController.getMessages)

// Générer les questions IA
router.post('/:id/questions', interviewController.generateQuestions)

// Soumettre une réponse à une question
router.post('/:id/answers', interviewController.submitAnswer)

// Obtenir le bilan de l'entretien
router.get('/:id/review', interviewController.getReview)

// Forcer la fin de l'entretien (timer écoulé)
router.post('/:id/end', interviewController.endInterview)

export default router
