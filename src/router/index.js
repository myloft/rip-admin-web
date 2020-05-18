import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import All from '../components/Animes/All.vue'
import Mine from '../components/Animes/Mine.vue'
import Password from '../components/Users/Password.vue'
import Users from '../components/Users/Users.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/all', component: All },
        { path: '/mine', component: Mine },
        { path: '/password', component: Password },
        { path: '/users', component: Users }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // to 目标 from 来源 next 方法
  // next() 放行 next（'/login') 强行跳转
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.localStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
