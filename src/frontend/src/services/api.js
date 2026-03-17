/**
 * api.js — Client HTTP Axios pour communiquer avec le backend
 * 
 * Configure Axios avec une baseURL /api qui est proxiée par Vite
 * vers le serveur Express (localhost:3000) en développement.
 * Voir vite.config.js pour la configuration du proxy.
 */
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',       // Proxié vers localhost:3000/api par Vite
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient
