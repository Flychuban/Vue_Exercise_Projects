// https://nuxt.com/docs/api/configuration/nuxt-config

require('dotenv').config();

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GMAPS_API_KEY ?? '',
    },
  }
})
