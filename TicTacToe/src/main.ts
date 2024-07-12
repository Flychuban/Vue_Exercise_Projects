import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import MyGame  from "./components/MyGame.vue"
import GameSettings from "./components/GameSettings.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", redirect: "/game"},
        {path: "/game", name: "game", component: MyGame},
        {path: "/settings", name: "settings", component: GameSettings}
    ]
})

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.mount('#app');
