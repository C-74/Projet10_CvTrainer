/**
 * interviewRoutes.js — Routes de l'API pour les entretiens
 * 
 * Définit toutes les routes /api/interviews/* :
 * - POST /             → Créer un entretien (avec upload CV via Multer)
 * - POST /:id/chat     → Chat conversationnel avec l'IA
 * - POST /:id/end      → Forcer la fin de l'entretien (timer écoulé)
 * - GET  /:id/messages → Récupérer les messages de la conversation
 * - POST /:id/questions → Générer des questions (placeholder)
 * - POST /:id/answers  → Soumettre une réponse (placeholder)
 * - GET  /:id/review   → Obtenir le bilan (placeholder)
 */
import { Router } from 'express'
import * as interviewController from '../controllers/interviewController.js'
import { upload } from '../middlewares/upload.js'

const router = Router()

// Créer un entretien (upload CV en multipart/form-data + description de poste)
router.post('/', upload.single('cv'), interviewController.create)

// Chat avec l'IA (envoyer un message ou démarrer la conversation)
router.post('/:id/chat', interviewController.chat)

// Récupérer les messages d'un entretien (pour rechargement)
router.get('/:id/messages', interviewController.getMessages)

// Générer les questions IA (placeholder — non utilisé dans le flux chat)
router.post('/:id/questions', interviewController.generateQuestions)

// Soumettre une réponse à une question (placeholder — non utilisé dans le flux chat)
router.post('/:id/answers', interviewController.submitAnswer)

// Obtenir le bilan de l'entretien (placeholder — le bilan passe par le chat)
router.get('/:id/review', interviewController.getReview)

// Forcer la fin de l'entretien quand le timer est écoulé
router.post('/:id/end', interviewController.endInterview)

export default router
