<script setup>

import { ref, onMounted } from 'vue'
import { Loader } from "@googlemaps/js-api-loader"


const loader = new Loader({
  apiKey: "AIzaSyDOc0GjZZ2KF5rzCyW2V8t7Ozxvmz553Lk",
})

const mapDiv = ref(null)

onMounted(async () => {
  await loader.importLibrary('maps')
  .then(
    ({Map}) => {
      new Map(mapDiv.value, {
        center: { lat: 42.69, lng: 23.32 },
        zoom: 11,
        gestureHandling: "cooperative",
        mapTypeId: 'roadmap'
      });
    }
  )
})

</script>

<template>
  <h1>Maps</h1>
  <div ref="mapDiv" class="map-container"></div>
</template>

<style scoped>

h1 {
  text-align: center;
}
.map-container {
  width: 90dvw;
  height: 90dvh;
  margin: auto;
}

</style>