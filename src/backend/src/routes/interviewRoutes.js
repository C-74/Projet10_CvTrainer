import { Router } from 'express'
import * as interviewController from '../controllers/interviewController.js'
import { upload } from '../middlewares/upload.js'

const router = Router()

// Créer un entretien (upload CV + description de poste)
router.post('/', upload.single('cv'), interviewController.create)

// Générer les questions IA
router.post('/:id/questions', interviewController.generateQuestions)

// Soumettre une réponse à une question
router.post('/:id/answers', interviewController.submitAnswer)

// Obtenir le bilan de l'entretien
router.get('/:id/review', interviewController.getReview)

export default router
