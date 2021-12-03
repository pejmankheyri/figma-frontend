import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const page = (path) => () =>
    import (`~/pages/${path}`).then((m) => m.default || m)

const routes = [{
        path: '/',
        name: 'index',
        component: page('index.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: page('auth/login.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: page('auth/register.vue'),
    },
    {
        path: '/designs/:id/edit',
        name: 'designs.edit',
        component: page('user/designs/edit.vue'),
    },
    {
        path: '/designs',
        name: 'designs.search',
        component: page('designs/search.vue'),
    },
    {
        path: '/design/:slug',
        name: 'designs.show',
        component: page('designs/show.vue'),
    },
]

export function createRouter() {
    return new Router({
        routes,
        mode: 'history',
    })
}