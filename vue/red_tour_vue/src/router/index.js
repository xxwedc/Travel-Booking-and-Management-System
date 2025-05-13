import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../Layout/Layout.vue'
import UpdateNews from '../views/otherPage/updateNews.vue'
import AccountView from '../views/account.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/forgotPassword',
        name: 'ForgotPassword',
        component: () => import('../views/otherPage/forgotPassword.vue')
    },
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/Home.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'scenic',
                name: 'Scenic',
                component: () => import('../views/scenic.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'user',
                name: 'User',
                component: () => import('../views/user.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'news',
                name: 'News',
                component: () => import('../views/news.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'order',
                name: 'Order',
                component: () => import('../views/order.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'comment',
                name: 'Comment',
                component: () => import('../views/comment.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'updateNews',
                name: 'UpdateNews',
                component: () => import('@/views/otherPage/updateNews.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'updateScenic',
                name: 'UpdateScenic',
                component: () => import('../views/otherPage/updateScenic.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'addScenic',
                name: 'AddScenic',
                component: () => import('../views/otherPage/addScenic.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/account',
                name: 'Account',
                component: AccountView,
                meta: {
                    requiresAuth: true,
                    title: '个人信息'
                }
            }
            // ... 其他需要登录的路由
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    
    // 如果需要登录且没有token
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next('/login')
    } else if (to.path === '/login' && token) {
        // 如果已登录且要去登录页，重定向到首页
        next('/')
    } else {
        next()
    }
})

export default router
