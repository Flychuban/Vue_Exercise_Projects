<!-- Tic Tac Toe game -->

<script setup>
import MyBoard from './components/MyBoard.vue'
import MyGame from './components/MyGame.vue'
import GameSettings from './components/GameSettings.vue'
import { onBeforeMount } from 'vue'

import { useSettingsStore } from './stores/settings_store' 

const settingsStore = useSettingsStore()

// When the app is mounted (app init), check if there are settings in localStorage
onBeforeMount(() => {
  if(!localStorage.getItem('settings')) {
    settingsStore.showSettings = true
  } else {
    settingsStore.initSettings()
  }
})

</script>

<template>
  <div id="app">
    <h1>Tic Tac Toe</h1>

    <!-- Conditionally render components based on settingsSubmitted -->
    <GameSettings v-if="settingsStore.showSettings"/>
    <MyGame v-else />
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
