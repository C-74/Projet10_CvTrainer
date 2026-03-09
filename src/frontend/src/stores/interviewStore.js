import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInterviewStore = defineStore('interview', () => {
  const currentInterview = ref(null)
  const questions = ref([])
  const answers = ref([])
  const isTimerEnabled = ref(false)

  function reset() {
    currentInterview.value = null
    questions.value = []
    answers.value = []
    isTimerEnabled.value = false
  }

  return {
    currentInterview,
    questions,
    answers,
    isTimerEnabled,
    reset
  }
})
