import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'

Vue.use(Router)

const router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'login',
            title: '绑定',
            component: login,
            meta: {
                title: '绑定',
                keepAlive: false
            }
        },
        {
            path: '/menu',
            name: 'menu',
            title: '商品展示',
            component: () => import('@/views/menu.vue'),
            meta: {
                title: '商品展示',
                keepAlive: false
            }
        },
        {
            path: '/detail',
            name: 'detail',
            title: '商品详情',
            component: () => import('@/views/detail.vue'),
            meta: {
                title: '商品展示',
                keepAlive: false
            }
        },
    ]
});

router.beforeEach((to, from, next) => {
    next();
});
export default router;
