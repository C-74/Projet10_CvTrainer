/**
 * router/index.js — Configuration du routeur Vue Router
 * 
 * Définit les 4 routes de l'application :
 * - /              → Page d'accueil (upload CV + historique)
 * - /interview/:id → Page de chat avec l'IA (entretien en cours)
 * - /review/:id    → Page de bilan (placeholder)
 * - /history       → Page d'historique complète (placeholder)
 * 
 * Les composants InterviewView, ReviewView et HistoryView sont chargés
 * en lazy-loading (import dynamique) pour optimiser le bundle initial.
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView  // Chargé immédiatement (page d'entrée)
  },
  {
    path: '/interview/:id',
    name: 'interview',
    component: () => import('../views/InterviewView.vue')  // Lazy-loaded
  },
  {
    path: '/review/:id',
    name: 'review',
    component: () => import('../views/ReviewView.vue')  // Lazy-loaded (placeholder)
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue')  // Lazy-loaded (placeholder)
  }
]

const router = createRouter({
  history: createWebHistory(),  // Mode HTML5 History (pas de hash #)
  routes
})

export default router
