import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import GameView from '../views/GameView.vue';
import RankingView from '../views/RankingView.vue';  


const routes: Array<RouteRecordRaw> = [
  
  {
    path: '/',
    redirect: '/home'
  },
  { path: '/game', 
    name : 'game',
    component: GameView },
  {
    path: '/ranking',
    name: 'ranking',
    component: RankingView,  // Ajout de la route
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  }
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router




