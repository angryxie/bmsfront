import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/home',
      name:'Home',
      component:Home,
      children:[
        {
          path:'a',
          name:'a',
          component:()=>import('@/components/A')
        },
        {
          path:'customerInfo',
          name:'CustomerInfo',
          component:()=>import('@/components/CustomerInfo')
        },
        {
          path:'orderInfo',
          name:'OrderInfo',
          component:()=>import('@/components/OrderInfo')
        },
        {
          path:'userinfo',
          name:'UserInfo',
          component:()=>import('@/components/UserInfo')
        }
      ]
    }
  ]
})
