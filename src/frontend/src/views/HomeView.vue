<template>
  <div class="h-full flex">

    <!-- ============ PANNEAU GAUCHE : Historique ============ -->
    <aside class="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div class="px-4 py-3 border-b border-gray-200">
        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Historique</h2>
      </div>
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div
          v-for="item in history"
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

        <p v-if="history.length === 0" class="text-xs text-gray-400 text-center py-4">
          Aucun historique pour le moment
        </p>
      </div>
    </aside>

    <!-- ============ PANNEAU DROIT : Formulaire ============ -->
    <div class="flex-1 flex items-center justify-center p-4 overflow-y-auto">
      <div class="w-full max-w-2xl">
        <!-- Titre -->
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-gray-900 mb-3">Simulateur d'entretien</h1>
          <p class="text-gray-500 text-lg">Envoyez votre CV et une description de poste pour démarrer une simulation avec l'IA.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Description de l'offre -->
          <div>
            <label for="jobDescription" class="block text-sm font-semibold text-gray-700 mb-2">
              Description de l'offre
            </label>
            <textarea
              id="jobDescription"
              v-model="jobDescription"
              rows="8"
              placeholder="Collez ici la description du poste visé..."
              class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition"
              required
            ></textarea>
          </div>

          <!-- Upload CV -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              CV (PDF uniquement)
            </label>
            <div
              class="relative border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer"
              :class="cvFile ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'"
              @click="$refs.fileInput.click()"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf"
                class="hidden"
                @change="handleFileChange"
              />

              <div v-if="!cvFile" class="space-y-2">
                <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16v-8m0 0l-3 3m3-3l3 3M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm text-gray-500">
                  <span class="font-medium text-indigo-600">Cliquez pour choisir un fichier</span> ou glissez-déposez
                </p>
                <p class="text-xs text-gray-400">PDF uniquement</p>
              </div>

              <div v-else class="flex items-center justify-center space-x-3">
                <svg class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">{{ cvFile.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(cvFile.size) }}</p>
                </div>
                <button
                  type="button"
                  @click.stop="removeFile"
                  class="ml-2 text-gray-400 hover:text-red-500 transition"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <p v-if="fileError" class="mt-1 text-sm text-red-600">{{ fileError }}</p>
          </div>

          <!-- Mode Timer -->
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-700">Mode Timer</p>
                <p class="text-xs text-gray-400 mt-0.5">Ajouter une contrainte de temps</p>
              </div>
              <button
                type="button"
                @click="timerEnabled = !timerEnabled"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="timerEnabled ? 'bg-indigo-600' : 'bg-gray-300'"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="timerEnabled ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>
            <div v-if="timerEnabled" class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="opt in timerOptions"
                :key="opt.value"
                type="button"
                @click="timerMinutes = opt.value"
                class="px-3 py-1.5 rounded-full text-xs font-medium transition"
                :class="timerMinutes === opt.value ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-indigo-400'"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Bouton Envoyer -->
          <button
            type="submit"
            :disabled="!canSubmit || isSubmitting"
            class="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm transition"
            :class="canSubmit && !isSubmitting ? 'bg-indigo-600 hover:bg-indigo-700 shadow-sm' : 'bg-gray-300 cursor-not-allowed'"
          >
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ isSubmitting ? 'Envoi en cours...' : 'Démarrer l\'entretien' }}
          </button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInterviewStore } from '../stores/interviewStore.js'
import apiClient from '../services/api.js'

const router = useRouter()
const store = useInterviewStore()

const jobDescription = ref('')
const cvFile = ref(null)
const fileError = ref('')
const isSubmitting = ref(false)
const isDragging = ref(false)
const history = ref([])
const timerEnabled = ref(false)
const timerMinutes = ref(10)
const timerOptions = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 }
]

const canSubmit = computed(() => jobDescription.value.trim() && cvFile.value)

// Charger l'historique au montage
onMounted(async () => {
  try {
    const { data } = await apiClient.get('/history')
    history.value = data.interviews || []
  } catch {
    // L'historique sera vide
  }
})

function handleFileChange(event) {
  const file = event.target.files[0]
  validateAndSetFile(file)
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  validateAndSetFile(file)
}

function validateAndSetFile(file) {
  fileError.value = ''
  if (!file) return
  if (file.type !== 'application/pdf') {
    fileError.value = 'Seuls les fichiers PDF sont acceptés.'
    return
  }
  cvFile.value = file
}

function removeFile() {
  cvFile.value = null
  fileError.value = ''
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' o'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko'
  return (bytes / 1048576).toFixed(1) + ' Mo'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
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
    router.push({ name: 'interview', params: { id: interview.id } })
  } catch (error) {
    console.error('Erreur chargement historique:', error)
  }
}

async function deleteInterview(id) {
  try {
    await apiClient.delete(`/history/${id}`)
    history.value = history.value.filter(h => h.id !== id)
  } catch (error) {
    console.error('Erreur suppression:', error)
  }
}

async function handleSubmit() {
  if (!canSubmit.value || isSubmitting.value) return
  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('cv', cvFile.value)
    formData.append('jobDescription', jobDescription.value)

    const { data } = await apiClient.post('/interviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    store.startInterview({
      id: data.id,
      jobDescription: jobDescription.value,
      cvFilename: cvFile.value.name,
      cvData: data.cv_data || null,
      timer: timerEnabled.value ? timerMinutes.value * 60 : 0
    })

    router.push({ name: 'interview', params: { id: data.id } })
  } catch (error) {
    console.error('Erreur lors de la création de l\'entretien:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
