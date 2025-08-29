
import { createRouter, createWebHistory } from 'vue-router';

// Importar tus componentes (views)
const HomePage = () => import('@/views/HomePage.vue');
const ContactsPage = () => import('@/views/ContactsPage.vue');

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
        {
        path: '/contacts',
        name: 'Home',
        component: ContactsPage
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;