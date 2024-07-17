
<script setup>

import { useSettingsStore } from '../store/settings_store'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const settingsStore = useSettingsStore()
const router = useRouter()

onBeforeMount(() => {
    if (!localStorage.getItem('settings')) {
        settingsStore.showSettings = true
        return router.push('/settings')
    } else {
        console.log('Settings found in localStorage')
        settingsStore.initSettings()
        settingsStore.showSettings = false;
        return router.push('/game')
    }
})

</script>

<template>
    <div id="app">
        <NuxtPage />
    </div>
</template>

<style scoped>
#app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

</style>