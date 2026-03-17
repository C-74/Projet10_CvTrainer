/**
 * interviewStore.js — Store Pinia pour la gestion de l'état de l'entretien
 * 
 * Gère l'état global de l'application côté frontend :
 * - currentInterview : Données de l'entretien en cours (id, description, CV)
 * - Timer : Durée configurée, temps restant, et état du timer
 * - questions/answers : Collections pour les questions et réponses (placeholder)
 * 
 * Le timer est persisté dans le store pour survivre aux navigations
 * entre pages sans perdre le temps restant.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInterviewStore = defineStore('interview', () => {
  // === État de l'entretien ===
  const currentInterview = ref(null)   // { id, jobDescription, cvFilename, cvData }
  const questions = ref([])             // Questions générées (placeholder)
  const answers = ref([])               // Réponses du candidat (placeholder)

  // === État du timer ===
  const isTimerEnabled = ref(false)     // Timer activé pour cet entretien ?
  const timerDuration = ref(0)          // Durée initiale en secondes (ex: 600 = 10 min)
  const timerRemaining = ref(0)         // Temps restant en secondes (persisté entre navigations)

  /**
   * Démarrer un nouvel entretien et initialiser l'état.
   * Appelé après la création via l'API ou lors du chargement depuis l'historique.
   * 
   * @param {Object} params
   * @param {number} params.id - ID de l'entretien
   * @param {string} params.jobDescription - Description du poste
   * @param {string} params.cvFilename - Nom du fichier CV
   * @param {Object|null} params.cvData - Données structurées du CV
   * @param {number} [params.timer=0] - Durée du timer en secondes (0 = désactivé)
   */
  function startInterview({ id, jobDescription, cvFilename, cvData, timer }) {
    currentInterview.value = { id, jobDescription, cvFilename, cvData: cvData || null }
    questions.value = []
    answers.value = []

    // Configurer le timer si une durée est spécifiée
    if (timer) {
      isTimerEnabled.value = true
      timerDuration.value = timer
      timerRemaining.value = timer
    } else {
      isTimerEnabled.value = false
      timerDuration.value = 0
      timerRemaining.value = 0
    }
  }

  /**
   * Sauvegarder le temps restant dans le store.
   * Appelé chaque seconde par le countdown et lors du démontage du composant
   * pour permettre la reprise du timer après navigation.
   * 
   * @param {number} seconds - Temps restant en secondes
   */
  function saveTimerRemaining(seconds) {
    timerRemaining.value = seconds
  }

  /**
   * Réinitialiser tout l'état du store (retour à l'accueil).
   */
  function reset() {
    currentInterview.value = null
    questions.value = []
    answers.value = []
    isTimerEnabled.value = false
    timerDuration.value = 0
    timerRemaining.value = 0
  }

  return {
    // État
    currentInterview,
    questions,
    answers,
    isTimerEnabled,
    timerDuration,
    timerRemaining,
    // Actions
    startInterview,
    saveTimerRemaining,
    reset
  }
})
