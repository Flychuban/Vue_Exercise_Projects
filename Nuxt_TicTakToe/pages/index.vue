<template>
    <div>
        <h1>Tic Tac Toe</h1>
        <NuxtLink to="/game">Go to Game</NuxtLink>
        <NuxtLink to="/settings">Go to Settings</NuxtLink>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
    h1 {
        font-size: 4rem;
        margin-bottom: 7.5vh;
    }
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    a {
        font-size: 2rem;
        margin: 1rem;
    }
</style>