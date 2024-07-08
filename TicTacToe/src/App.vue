<!-- Tic Tac Toe game -->

<script setup>
import MyBoard from './components/MyBoard.vue'
import MyGame from './components/MyGame.vue'
import GameSettings from './components/GameSettings.vue'

import { ref } from 'vue'

const settings = ref(null)
const settingsSubmitted = ref(false)

const handleSettingsChange = (newSettings) => {
  settings.value = newSettings
  settingsSubmitted.value = true
}

</script>

<template>
  <div id="app">
    <h1>Tic Tac Toe</h1>

    <!-- Conditionally render components based on settingsSubmitted -->
    <GameSettings v-if="!settingsSubmitted" @change-settings="handleSettingsChange"/>
    <MyGame v-else :settings="settings" />
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
