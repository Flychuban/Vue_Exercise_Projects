<!-- Tic Tac Toe game -->

<script setup lang="ts">
import MyGame from './components/MyGame.vue'
import GameSettings from './components/GameSettings.vue'
import { onBeforeMount, computed } from 'vue'
import { useSettingsStore } from './stores/settings_store' 
import { useRouter } from 'vue-router'


const settingsStore = useSettingsStore()
const router = useRouter()

// When the app is mounted (app init), check if there are settings in localStorage
onBeforeMount(() :void => {
  if(!localStorage.getItem('settings')) {
    settingsStore.showSettings = true
    router.replace('/settings'); // Redirect to settings if no settings are found
  } else {
    console.log('Settings found in localStorage')
    settingsStore.initSettings()
    settingsStore.showSettings = false;
    router.replace('/game'); // Redirect to game if settings are found
  }
})

</script>

<template>
  <div id="app">
    <h1>Tic Tac Toe</h1>

    <!-- Conditionally render components based on settingsSubmitted -->
    <!-- <router-link v-if="settingsStore.showSettings" to="/settings">
      <GameSettings />
    </router-link>
    <router-link v-if="!settingsStore.showSettings" to="/game">
      <MyGame />
    </router-link> -->

    <!-- Automatically renders the correct component based on the current route -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-center;
  height: 100vh;
}

h1 {
  font-size: 4rem;
  margin-bottom: 7.5vh;
}
</style>
