import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/interview/:id',
    name: 'interview',
    component: () => import('../views/InterviewView.vue')
  },
  {
    path: '/review/:id',
    name: 'review',
    component: () => import('../views/ReviewView.vue')
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
