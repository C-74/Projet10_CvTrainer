<template>
  <div class="h-full flex">

    <!-- ============ PANNEAU GAUCHE : Historique ============ -->
    <aside class="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div class="px-4 py-3 border-b border-gray-200">
        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Historique</h2>
      </div>
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <!-- Entretien actif -->
        <div
          v-if="store.currentInterview"
          class="group relative p-3 rounded-lg bg-indigo-50 border border-indigo-200"
        >
          <button
            @click.stop="deleteInterview(store.currentInterview.id, true)"
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-indigo-200 text-indigo-400 hover:text-indigo-700"
            title="Supprimer"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <p class="text-xs font-semibold text-indigo-600 mb-1">En cours</p>
          <p class="text-sm font-medium text-gray-900 truncate">{{ store.currentInterview.cvFilename }}</p>
          <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ store.currentInterview.jobDescription }}</p>
        </div>

        <!-- Anciens entretiens -->
        <div
          v-for="item in filteredHistory"
          :key="item.id"
          class="group relative p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition border border-transparent hover:border-gray-200"
          @click="loadFromHistory(item)"
        >
          <button
            @click.stop="deleteInterview(item.id)"
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-600"
            title="Supprimer"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <p class="text-sm font-medium text-gray-800 truncate">{{ item.cv_filename || 'CV sans nom' }}</p>
          <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ item.job_description }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.created_at) }}</p>
        </div>

        <p v-if="filteredHistory.length === 0" class="text-xs text-gray-400 text-center py-4">
          Aucun historique pour le moment
        </p>
      </div>
    </aside>

    <!-- ============ PANNEAU CENTRAL : Chat ============ -->
    <section class="flex-1 flex flex-col min-w-0" :class="{ 'timer-danger-glow': isTimerDanger && !isInterviewFinished }">

      <!-- Barre de progression -->
      <div class="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-medium text-gray-500">Progression de l'entretien</span>
          <div class="flex items-center gap-3">
            <!-- Timer countdown -->
            <span
              v-if="store.isTimerEnabled && !isInterviewFinished"
              class="text-xs font-mono font-bold px-2 py-0.5 rounded-md transition-colors"
              :class="isTimerDanger ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-700'"
            >
              ⏱ {{ formatTime(remainingTime) }}
            </span>
            <span v-else-if="store.isTimerEnabled && isInterviewFinished" class="text-xs font-medium text-gray-400">
              ⏱ Terminé
            </span>
            <span class="text-xs font-semibold" :class="isInterviewFinished ? 'text-green-600' : 'text-indigo-600'">
              {{ isInterviewFinished ? 'Terminé' : `Question ${questionsAnswered} / ~${estimatedTotal}` }}
            </span>
          </div>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-700 ease-out"
            :class="isInterviewFinished ? 'bg-green-500' : isTimerDanger ? 'bg-red-500' : 'bg-indigo-500'"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Messages -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-4">

        <template v-for="(msg, index) in processedMessages" :key="index">
          <!-- Message utilisateur -->
          <div v-if="msg.type === 'user'" class="flex justify-end">
            <div class="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-indigo-600 text-white">
              <p class="whitespace-pre-wrap">{{ msg.content }}</p>
            </div>
          </div>

          <!-- Message assistant simple -->
          <div v-else-if="msg.type === 'assistant'" class="flex justify-start">
            <div class="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white border border-gray-200 text-gray-800">
              <p class="whitespace-pre-wrap">{{ msg.content }}</p>
            </div>
          </div>

          <!-- Message assistant avec feedback -->
          <div v-else-if="msg.type === 'with-feedback'" class="flex justify-start">
            <div class="max-w-[75%] space-y-2">
              <button
                @click="toggleFeedback(index)"
                class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition"
                :class="visibleFeedbacks.has(index)
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600'"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {{ visibleFeedbacks.has(index) ? 'Masquer le feedback' : 'Voir le feedback' }}
              </button>
              <div v-if="visibleFeedbacks.has(index)" class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 leading-relaxed">
                <p class="whitespace-pre-wrap">{{ msg.feedback }}</p>
              </div>
              <div class="rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white border border-gray-200 text-gray-800">
                <p class="whitespace-pre-wrap">{{ msg.question }}</p>
              </div>
            </div>
          </div>

          <!-- Bilan structuré -->
          <div v-else-if="msg.type === 'bilan'" class="w-full space-y-4">
            <!-- Bilan JSON parsé -->
            <div v-if="msg.bilanData" class="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-2xl border border-indigo-200 shadow-sm p-6 space-y-5">
              <!-- Header + Score -->
              <div class="text-center">
                <h3 class="text-lg font-bold text-gray-900 mb-3">Bilan de l'entretien</h3>
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full border-4"
                  :class="msg.bilanData.score >= 7 ? 'bg-green-50 border-green-400' : msg.bilanData.score >= 5 ? 'bg-amber-50 border-amber-400' : 'bg-red-50 border-red-400'">
                  <span class="text-2xl font-bold" :class="msg.bilanData.score >= 7 ? 'text-green-700' : msg.bilanData.score >= 5 ? 'text-amber-700' : 'text-red-700'">
                    {{ msg.bilanData.score }}<span class="text-sm opacity-60">/{{ msg.bilanData.maxScore || 10 }}</span>
                  </span>
                </div>
              </div>

              <!-- Points forts / À améliorer -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h4 class="text-sm font-bold text-green-700 mb-2 flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Points forts
                  </h4>
                  <ul class="space-y-1.5">
                    <li v-for="(p, pi) in msg.bilanData.pointsForts" :key="pi" class="text-sm text-green-800 flex items-start gap-1.5">
                      <span class="text-green-400 mt-0.5 flex-shrink-0">•</span><span>{{ p }}</span>
                    </li>
                  </ul>
                </div>
                <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h4 class="text-sm font-bold text-orange-700 mb-2 flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Points à améliorer
                  </h4>
                  <ul class="space-y-1.5">
                    <li v-for="(p, pi) in msg.bilanData.pointsAAmeliorer" :key="pi" class="text-sm text-orange-800 flex items-start gap-1.5">
                      <span class="text-orange-400 mt-0.5 flex-shrink-0">•</span><span>{{ p }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Conseil général -->
              <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 class="text-sm font-bold text-blue-700 mb-2 flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  Conseil général
                </h4>
                <p class="text-sm text-blue-800 leading-relaxed">{{ msg.bilanData.conseilGeneral }}</p>
              </div>

              <!-- Réponses suggérées -->
              <div v-if="msg.bilanData.reponsesSuggerees?.length">
                <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Réponses suggérées
                </h4>
                <div class="space-y-3">
                  <div v-for="(r, ri) in msg.bilanData.reponsesSuggerees" :key="ri" class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p class="text-sm font-medium text-gray-900 mb-1">{{ ri + 1 }}. « {{ r.question }} »</p>
                    <p class="text-sm text-gray-600 italic ml-4">→ {{ r.reponseIdeale }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fallback : bilan brut si JSON invalide -->
            <div v-else class="bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm leading-relaxed text-gray-800">
              <h3 class="font-bold text-gray-900 mb-2">Bilan de l'entretien</h3>
              <p class="whitespace-pre-wrap">{{ msg.bilanRaw }}</p>
            </div>

            <!-- Message de clôture -->
            <div v-if="msg.closingMessage" class="flex justify-start">
              <div class="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white border border-gray-200 text-gray-800">
                <p class="whitespace-pre-wrap">{{ msg.closingMessage }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Indicateur de chargement IA -->
        <div v-if="isAiTyping" class="flex justify-start">
          <div class="bg-white border border-gray-200 rounded-2xl px-4 py-3">
            <div class="flex space-x-1.5">
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone de saisie (masquée quand l'entretien est terminé ou timer écoulé) -->
      <div v-if="!isInterviewFinished && !timerExpired" class="border-t border-gray-200 bg-white p-4">
        <form @submit.prevent="sendMessage" class="flex items-end gap-3">
          <textarea
            v-model="userInput"
            rows="1"
            placeholder="Tapez votre réponse..."
            class="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            @keydown.enter.exact.prevent="sendMessage"
            @input="autoResize"
            ref="inputField"
          ></textarea>
          <button
            type="submit"
            :disabled="!userInput.trim() || isAiTyping"
            class="flex-shrink-0 p-3 rounded-xl transition"
            :class="userInput.trim() && !isAiTyping ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </section>

    <!-- ============ PANNEAU DROIT : Infos CV + Offre ============ -->
    <aside class="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <!-- Description de l'offre -->
      <div class="border-b border-gray-200 flex flex-col" style="max-height: 40%">
        <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Description de l'offre</h2>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <p class="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {{ store.currentInterview?.jobDescription || 'Aucune description chargée' }}
          </p>
        </div>
      </div>

      <!-- Aperçu du CV -->
      <div class="flex-1 flex flex-col min-h-0">
        <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Aperçu du CV</h2>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Données extraites du CV -->
          <div v-if="cvData" class="space-y-4">

            <!-- Identité -->
            <div v-if="cvData.identite">
              <h3 class="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Identité</h3>
              <p class="text-sm font-semibold text-gray-900">{{ cvData.identite.prenom }} {{ cvData.identite.nom }}</p>
              <p v-if="cvData.identite.titre" class="text-xs text-gray-500">{{ cvData.identite.titre }}</p>
              <div class="mt-1 space-y-0.5 text-xs text-gray-500">
                <p v-if="cvData.identite.email">{{ cvData.identite.email }}</p>
                <p v-if="cvData.identite.telephone">{{ cvData.identite.telephone }}</p>
                <p v-if="cvData.identite.adresse">{{ cvData.identite.adresse }}</p>
                <p v-if="cvData.identite.permis">Permis : {{ cvData.identite.permis }}</p>
              </div>
              <p v-if="cvData.identite.profil" class="mt-1 text-xs text-gray-600 italic leading-relaxed">{{ cvData.identite.profil }}</p>
            </div>

            <hr class="border-gray-100" />

            <!-- Formations -->
            <div v-if="cvData.formations?.length">
              <h3 class="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Formations</h3>
              <div v-for="(f, i) in cvData.formations" :key="i" class="mb-2">
                <p class="text-xs font-semibold text-gray-800">{{ f.diplome }}</p>
                <p class="text-xs text-gray-500">{{ f.etablissement }}</p>
                <p class="text-xs text-gray-400">{{ f.periode }}</p>
              </div>
            </div>

            <hr class="border-gray-100" />

            <!-- Expériences -->
            <div v-if="cvData.experiences?.length">
              <h3 class="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Expériences</h3>
              <div v-for="(e, i) in cvData.experiences" :key="i" class="mb-2">
                <p class="text-xs font-semibold text-gray-800">{{ e.poste }}</p>
                <p class="text-xs text-gray-500">{{ e.entreprise }} — {{ e.periode }}</p>
                <ul v-if="e.missions?.length" class="mt-0.5 list-disc list-inside text-xs text-gray-500">
                  <li v-for="(m, j) in e.missions" :key="j">{{ m }}</li>
                </ul>
              </div>
            </div>

            <hr class="border-gray-100" />

            <!-- Compétences -->
            <div v-if="cvData.competences">
              <h3 class="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Compétences</h3>
              <div v-if="cvData.competences.informatique?.length" class="mb-1">
                <p class="text-xs font-medium text-gray-700">Informatique</p>
                <div class="flex flex-wrap gap-1 mt-0.5">
                  <span v-for="(c, i) in cvData.competences.informatique" :key="i" class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{{ c }}</span>
                </div>
              </div>
              <div v-if="cvData.competences.langues?.length" class="mb-1">
                <p class="text-xs font-medium text-gray-700">Langues</p>
                <div class="flex flex-wrap gap-1 mt-0.5">
                  <span v-for="(l, i) in cvData.competences.langues" :key="i" class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{{ l.langue }} ({{ l.niveau }})</span>
                </div>
              </div>
            </div>

            <hr class="border-gray-100" />

            <!-- Centres d'intérêt -->
            <div v-if="cvData.centresInteret?.length">
              <h3 class="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Centres d'intérêt</h3>
              <div class="flex flex-wrap gap-1">
                <span v-for="(ci, i) in cvData.centresInteret" :key="i" class="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{{ ci }}</span>
              </div>
            </div>

          </div>

          <!-- Pas de données CV -->
          <div v-else-if="store.currentInterview?.cvFilename" class="space-y-3">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="truncate">{{ store.currentInterview.cvFilename }}</span>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p class="text-xs text-gray-400 italic">Extraction des données en cours...</p>
            </div>
          </div>

          <p v-else class="text-sm text-gray-400 italic">Aucun CV chargé</p>
        </div>
      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInterviewStore } from '../stores/interviewStore.js'
import apiClient from '../services/api.js'

const route = useRoute()
const router = useRouter()
const store = useInterviewStore()

const cvData = computed(() => store.currentInterview?.cvData || null)

const messages = ref([])
const userInput = ref('')
const isAiTyping = ref(false)
const history = ref([])
const chatContainer = ref(null)
const inputField = ref(null)
const visibleFeedbacks = ref(new Set())
const estimatedTotal = 6

// Timer
const remainingTime = ref(store.timerRemaining || 0)
let timerInterval = null
const isTimerDanger = computed(() => store.isTimerEnabled && remainingTime.value > 0 && remainingTime.value <= 60)
const timerExpired = ref(false)

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function startTimer() {
  if (!store.isTimerEnabled || remainingTime.value <= 0) return
  stopTimer()
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
      store.saveTimerRemaining(remainingTime.value)
      if (remainingTime.value === 0) {
        stopTimer()
        handleTimerEnd()
      }
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

async function handleTimerEnd() {
  if (isInterviewFinished.value) return
  timerExpired.value = true
  isAiTyping.value = true
  try {
    const { data } = await apiClient.post(`/interviews/${store.currentInterview.id}/end`)
    messages.value.push({ role: data.role, content: data.content })
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: 'Le temps est écoulé. Désolé, une erreur est survenue lors de la génération du bilan.'
    })
  } finally {
    isAiTyping.value = false
  }
}

onUnmounted(() => {
  stopTimer()
  if (store.isTimerEnabled) {
    store.saveTimerRemaining(remainingTime.value)
  }
})

const filteredHistory = computed(() => {
  const currentId = store.currentInterview?.id
  return history.value.filter(h => h.id !== currentId)
})

const isInterviewFinished = computed(() => {
  return messages.value.some(m => m.content.includes('---FIN_BILAN---'))
})

const questionsAnswered = computed(() => messages.value.filter(m => m.role === 'user').length)

const progress = computed(() => {
  if (isInterviewFinished.value) return 100
  if (questionsAnswered.value === 0) return 5
  return Math.min(95, Math.round((questionsAnswered.value / estimatedTotal) * 100))
})

const processedMessages = computed(() => {
  return messages.value.map((msg) => {
    if (msg.role === 'user') return { ...msg, type: 'user' }

    const bilanMatch = msg.content.match(/---BILAN---([\s\S]*?)---FIN_BILAN---/)
    if (bilanMatch) {
      let bilanData = null
      try { bilanData = JSON.parse(bilanMatch[1].trim()) } catch {}
      const closingMessage = msg.content.split('---FIN_BILAN---')[1]?.trim() || ''
      return { ...msg, type: 'bilan', bilanData, bilanRaw: bilanMatch[1].trim(), closingMessage }
    }

    const feedbackMatch = msg.content.match(/\[FEEDBACK\]([\s\S]*?)\[\/FEEDBACK\]/)
    if (feedbackMatch) {
      const feedback = feedbackMatch[1].trim()
      const question = msg.content.replace(/\[FEEDBACK\][\s\S]*?\[\/FEEDBACK\]/, '').trim()
      return { ...msg, type: 'with-feedback', feedback, question }
    }

    return { ...msg, type: 'assistant' }
  })
})

function toggleFeedback(index) {
  const newSet = new Set(visibleFeedbacks.value)
  if (newSet.has(index)) newSet.delete(index)
  else newSet.add(index)
  visibleFeedbacks.value = newSet
}

onMounted(async () => {
  // Charger l'historique
  try {
    const { data } = await apiClient.get('/history')
    history.value = data.interviews || []
  } catch {
    // L'historique sera vide
  }

  // Démarrer l'entretien IA si on a un entretien en cours
  if (store.currentInterview?.id) {
    // Vérifier s'il y a déjà des messages sauvegardés
    try {
      const { data } = await apiClient.get(`/interviews/${store.currentInterview.id}/messages`)
      if (data.messages?.length > 0) {
        messages.value = data.messages
      } else {
        // Premier lancement : demander à l'IA de démarrer
        isAiTyping.value = true
        const { data: chatData } = await apiClient.post(`/interviews/${store.currentInterview.id}/chat`, {})
        messages.value.push({ role: chatData.role, content: chatData.content })
        isAiTyping.value = false
      }
    } catch {
      isAiTyping.value = false
      messages.value.push({
        role: 'assistant',
        content: 'Bonjour ! Je suis prêt à commencer l\'entretien. Dites-moi quand vous êtes prêt(e).'
      })
    }
  }

  // Démarrer le timer si actif et entretien pas terminé
  if (store.isTimerEnabled && !isInterviewFinished.value) {
    remainingTime.value = store.timerRemaining || store.timerDuration
    startTimer()
  }
})

// Auto-scroll vers le bas à chaque nouveau message
watch(messages, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}, { deep: true })

// Arrêter le timer si l'entretien est terminé
watch(isInterviewFinished, (finished) => {
  if (finished) stopTimer()
})

function autoResize(event) {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

async function sendMessage() {
  const text = userInput.value.trim()
  if (!text || isAiTyping.value) return

  messages.value.push({ role: 'user', content: text })
  userInput.value = ''

  // Réinitialiser la hauteur du textarea
  if (inputField.value) {
    inputField.value.style.height = 'auto'
  }

  isAiTyping.value = true

  try {
    const { data } = await apiClient.post(`/interviews/${store.currentInterview.id}/chat`, { message: text })
    messages.value.push({ role: data.role, content: data.content })
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: 'Désolé, une erreur est survenue. Veuillez réessayer.'
    })
  } finally {
    isAiTyping.value = false
  }
}

async function deleteInterview(id, isCurrent = false) {
  try {
    await apiClient.delete(`/history/${id}`)
    if (isCurrent) {
      store.reset()
    }
    history.value = history.value.filter(h => h.id !== id)
  } catch (error) {
    console.error('Erreur suppression:', error)
  }
}

async function loadFromHistory(item) {
  try {
    const { data } = await apiClient.get(`/history/${item.id}`)
    const interview = data.interview
    store.startInterview({
      id: interview.id,
      jobDescription: interview.job_description,
      cvFilename: interview.cv_filename,
      cvData: interview.cv_data || null
    })
    messages.value = data.messages || []
    visibleFeedbacks.value = new Set()
    // Mettre à jour l'URL sans déclencher de navigation Vue Router
    window.history.replaceState({}, '', `/interview/${interview.id}`)
  } catch (error) {
    console.error('Erreur chargement historique:', error)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
@keyframes danger-pulse {
  0%, 100% {
    box-shadow: inset 0 0 0 2px rgba(239, 68, 68, 0.3);
  }
  50% {
    box-shadow: inset 0 0 0 2px rgba(239, 68, 68, 0.7), 0 0 20px rgba(239, 68, 68, 0.15);
  }
}

.timer-danger-glow {
  animation: danger-pulse 1.5s ease-in-out infinite;
  border-radius: 0;
}
</style>
