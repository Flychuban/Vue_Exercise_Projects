<!-- Tic Tac Toe game -->

<script setup>
import { ref } from 'vue'

</script>

<template>
  <div id="app">
    <h1>Tic Tac Toe</h1>

    <div class="board-container">
      <div class="board">
        <div class="row" v-for="row in 3" :key="row">
          <div class="cell" v-for="cell in 3" :key="cell">
            <div class="cell-inner">
              <span class="cell-content"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="status">
        <div class="status-inner">
          <span class="status-content">Next player: X</span>
        </div>
      </div>
      <div class="restart">
        <button class="restart-button">Restart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
