// src/router/index.ts

import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
        },
        {
            path: '/repo',
            name: 'repo',
            component: () => import('@/views/RepoView.vue'),
        },
        {
            path: '/new-record',
            name: 'find-disease',
            component: () => import('@/views/FindDiseaseView.vue'),
        }
    ],
})

export default router