/**
 * historyRoutes.js — Routes de l'API pour l'historique des entretiens
 * 
 * Définit les routes /api/history/* :
 * - GET /        → Lister tous les entretiens passés
 * - GET /:id     → Récupérer le détail d'un entretien (avec messages et CV)
 * - DELETE /:id  → Supprimer un entretien
 */
import { Router } from 'express'
import * as historyController from '../controllers/historyController.js'

const router = Router()

// Lister tous les entretiens passés (triés par date décroissante)
router.get('/', historyController.list)

// Récupérer un entretien par ID (inclut les messages et le CV parsé)
router.get('/:id', historyController.getById)

// Supprimer un entretien et ses données associées
router.delete('/:id', historyController.remove)

export default router
