import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView // 主页
  },
  {
    path: '/',
    name: 'login',
    component: LoginView, // 登录页面
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 全局路由守卫 用于判断是否登录 每次路由跳转之前都检查yltoken是否存在作为登录标识
  const isLogin = localStorage.getItem('yltoken') ? true : false;
  if (to.path == '/') {
    next();
  } else {
    isLogin ? next() : next('/');
  }
})

export default router
