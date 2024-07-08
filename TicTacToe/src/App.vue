<!-- Tic Tac Toe game -->

<script setup>
import MyBoard from './components/MyBoard.vue'

</script>

<template>
  <div id="app">
    <h1>Tic Tac Toe</h1>
    <MyBoard />
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
