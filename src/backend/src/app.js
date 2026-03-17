/**
 * app.js — Configuration de l'application Express
 * 
 * Configure les middleware globaux et monte les routes de l'API :
 * - CORS activé (pour les requêtes cross-origin depuis le frontend Vite)
 * - JSON body parsing (pour les requêtes POST/PUT)
 * - Routes /api/interviews/* (entretiens, chat IA, fin forcée)
 * - Routes /api/history/* (historique des entretiens)
 * - Health check /api/health
 */
import express from 'express'
import cors from 'cors'
import interviewRoutes from './routes/interviewRoutes.js'
import historyRoutes from './routes/historyRoutes.js'

const app = express()

// Middleware globaux
app.use(cors())           // Autoriser les requêtes cross-origin
app.use(express.json())   // Parser le body JSON des requêtes

// Routes API
app.use('/api/interviews', interviewRoutes)  // Entretiens et chat IA
app.use('/api/history', historyRoutes)       // Historique des entretiens

// Health check pour vérifier que le serveur est actif
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
