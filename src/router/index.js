import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Pisteur from '@/views/Pisteur.vue'
import Depense from '@/views/Depense.vue'
import Chargement from '@/components/Chargement.vue'
import Magasin from '@/views/Magasin.vue'
import Gerant from '@/views/Gerant.vue'
import Exportateur from '@/views/Exportateur.vue'
import Recevoir from '@/components/Recevoir.vue'




const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/pisteur',
    name: 'Pisteur',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Pisteur

  },
  {
    path: '/depense',
    name: 'Depense',
    component: Depense
  },
  {
    path: '/chargement',
    name: 'Chargement',
    component: Chargement
  },
  {
    path: '/magasin',
    name: 'Magasin',
    component: Magasin
  },
  {
    path: '/gerant',
    name: 'Gerant',
    component: Gerant
  },
  {
    path: '/exportateur',
    name: 'Exportateur',
    component: Exportateur
  },
  {
    path: '/recevoir',
    name: 'Recevoir',
    component: Recevoir
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
