<template>
    <div>
        <h1>Tic Tac Toe</h1>
        <NuxtLink to="/game">Go to Game</NuxtLink>
        <NuxtLink to="/settings">Go to Settings</NuxtLink>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default'
})
</script>