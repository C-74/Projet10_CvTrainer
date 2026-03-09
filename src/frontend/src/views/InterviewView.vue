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
          class="p-3 rounded-lg bg-indigo-50 border border-indigo-200"
        >
          <p class="text-xs font-semibold text-indigo-600 mb-1">En cours</p>
          <p class="text-sm font-medium text-gray-900 truncate">{{ store.currentInterview.cvFilename }}</p>
          <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ store.currentInterview.jobDescription }}</p>
        </div>

        <!-- Anciens entretiens -->
        <div
          v-for="item in history"
          :key="item.id"
          class="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition border border-transparent hover:border-gray-200"
          @click="loadFromHistory(item)"
        >
          <p class="text-sm font-medium text-gray-800 truncate">{{ item.cv_filename || 'CV sans nom' }}</p>
          <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ item.job_description }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.created_at) }}</p>
        </div>

        <p v-if="history.length === 0" class="text-xs text-gray-400 text-center py-4">
          Aucun historique pour le moment
        </p>
      </div>
    </aside>

    <!-- ============ PANNEAU CENTRAL : Chat ============ -->
    <section class="flex-1 flex flex-col min-w-0">
      <!-- Messages -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex"
          :class="msg.role === 'assistant' ? 'justify-start' : 'justify-end'"
        >
          <div
            class="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
            :class="msg.role === 'assistant'
              ? 'bg-white border border-gray-200 text-gray-800'
              : 'bg-indigo-600 text-white'"
          >
            <p class="whitespace-pre-wrap">{{ msg.content }}</p>
          </div>
        </div>

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

      <!-- Zone de saisie -->
      <div class="border-t border-gray-200 bg-white p-4">
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
    <aside class="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
      <!-- Description de l'offre -->
      <div class="border-b border-gray-200 flex flex-col" style="max-height: 50%">
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
          <div v-if="store.currentInterview?.cvFilename" class="space-y-3">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="truncate">{{ store.currentInterview.cvFilename }}</span>
            </div>
            <!-- Aperçu du contenu extrait du CV (sera rempli quand l'OCR sera en place) -->
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p class="text-xs text-gray-400 italic">
                L'aperçu du contenu sera disponible après extraction du PDF.
              </p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 italic">Aucun CV chargé</p>
        </div>
      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useInterviewStore } from '../stores/interviewStore.js'
import apiClient from '../services/api.js'

const route = useRoute()
const store = useInterviewStore()

const messages = ref([])
const userInput = ref('')
const isAiTyping = ref(false)
const history = ref([])
const chatContainer = ref(null)
const inputField = ref(null)

onMounted(async () => {
  // Message d'accueil de l'IA
  messages.value.push({
    role: 'assistant',
    content: 'Bonjour ! Je suis votre recruteur pour cet entretien de simulation. J\'ai bien reçu votre CV et la description du poste. Je vais vous poser quelques questions. Prêt(e) à commencer ?'
  })

  // Charger l'historique
  try {
    const { data } = await apiClient.get('/history')
    history.value = data.interviews || []
  } catch {
    // L'historique sera vide
  }
})

// Auto-scroll vers le bas à chaque nouveau message
watch(messages, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}, { deep: true })

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
    // TODO: appeler le backend pour obtenir la réponse IA
    // Simulation temporaire
    await new Promise(resolve => setTimeout(resolve, 1500))
    messages.value.push({
      role: 'assistant',
      content: 'Merci pour cette réponse. Voici ma prochaine question...'
    })
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: 'Désolé, une erreur est survenue. Veuillez réessayer.'
    })
  } finally {
    isAiTyping.value = false
  }
}

function loadFromHistory(item) {
  // TODO: naviguer vers l'entretien historique
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
