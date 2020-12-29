import Vue from 'vue'
import VueRouter, { RouteConfig, Route } from 'vue-router'
import Home from '../views/Home.vue'
import Estimates from '../views/Estimates.vue'
import Products from '../views/Products.vue';
import Help from '../views/Help.vue';
import Estimate from '../views/Estimate.vue'
import EstimateChart from '../views/EstimateChart.vue'
import Login from '../views/Login.vue'
import MemberLogin from '../views/MemberLogin.vue'
import MemberView from '../views/MemberView.vue'
import Profile from '../views/Profile.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/estimates',
  },
  {
    path: '/team',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/member/:nr/login/:masterUid',
    name: 'MemberLogin',
    component: MemberLogin
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/member',
    name: 'Member',
    component: MemberView
  },
  {
    path: '/estimates',
    name: 'Estimates',
    component: Estimates
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/help',
    name: 'Help',
    component: Help
  },
  {
    path: '/estimate/:voteId',
    name: 'Estimate',
    component: Estimate
  },
  {
    path: '/estimatechart/:voteId',
    name: 'EstimateChart',
    component: EstimateChart
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
