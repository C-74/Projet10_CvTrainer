import { Router } from 'express'
import * as historyController from '../controllers/historyController.js'

const router = Router()

// Lister les anciens entretiens (CV + descriptions de poste)
router.get('/', historyController.list)

// Récupérer un entretien passé
router.get('/:id', historyController.getById)

// Supprimer un entretien
router.delete('/:id', historyController.remove)

export default router
