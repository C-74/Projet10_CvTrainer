import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInterviewStore = defineStore('interview', () => {
  const currentInterview = ref(null)
  const questions = ref([])
  const answers = ref([])
  const isTimerEnabled = ref(false)
  const timerDuration = ref(0)
  const timerRemaining = ref(0)

  function startInterview({ id, jobDescription, cvFilename, cvData, timer }) {
    currentInterview.value = { id, jobDescription, cvFilename, cvData: cvData || null }
    questions.value = []
    answers.value = []
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

  function saveTimerRemaining(seconds) {
    timerRemaining.value = seconds
  }

  function reset() {
    currentInterview.value = null
    questions.value = []
    answers.value = []
    isTimerEnabled.value = false
    timerDuration.value = 0
    timerRemaining.value = 0
  }

  return {
    currentInterview,
    questions,
    answers,
    isTimerEnabled,
    timerDuration,
    timerRemaining,
    startInterview,
    saveTimerRemaining,
    reset
  }
})
