<template>
  <div class="h-full flex items-center justify-center p-4">
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
</template>

<script setup>
import { ref, computed } from 'vue'
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

const canSubmit = computed(() => jobDescription.value.trim() && cvFile.value)

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
      cvData: data.cv_data || null
    })

    router.push({ name: 'interview', params: { id: data.id } })
  } catch (error) {
    console.error('Erreur lors de la création de l\'entretien:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
