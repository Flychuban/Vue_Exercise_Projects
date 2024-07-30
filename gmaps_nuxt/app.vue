<script setup>

import { ref, onMounted, onBeforeMount } from 'vue'
import { Loader } from "@googlemaps/js-api-loader"

import { useRuntimeConfig } from '#app'

const mapDiv = ref(null)

onMounted(async () => {
  const config = useRuntimeConfig();

  console.log("api keyyy: ", config.public.googleMapsApiKey)
  const loader = new Loader({
  apiKey: config.public.googleMapsApiKey,
  })
  console.log('mounted  ');
  const { Map } = await loader.importLibrary('maps')
  const { ElevationService } = await loader.importLibrary('elevation')
  const map = new Map(mapDiv.value, {
    center: { lat: 42.69, lng: 23.32 },
    zoom: 11,
    gestureHandling: "cooperative",
    mapTypeId: 'roadmap'
  });


  const elevator = new ElevationService();
  const infowindow = new google.maps.InfoWindow({});

  map.addListener("click", (event) => {
    displayLocationElevation(event.latLng, elevator, infowindow);
  });
})

function displayLocationElevation(location, elevator, infowindow) {
  // Initiate the location request
  elevator
    .getElevationForLocations({
      locations: [location],
    })
    .then(({ results }) => {
      infowindow.setPosition(location);
      // Retrieve the first result
      if (results[0]) {
        // Open the infowindow indicating the elevation at the clicked position.
        infowindow.setContent(
          "The elevation at this point <br>is " +
          results[0].elevation +
          " meters.",
        );
      } else {
        infowindow.setContent("No results found");
      }
    })
    .catch((e) =>
      infowindow.setContent("Elevation service failed due to: " + e),
    );
}

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