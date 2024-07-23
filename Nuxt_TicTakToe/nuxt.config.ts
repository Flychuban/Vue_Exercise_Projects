// https://nuxt.com/docs/api/configuration/nuxt-config
export default ({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/test-utils/module'],
  build: {
    transpile: ['@nuxtjs/pinia'],
  },
  typescript: {
    typeCheck: true
  }
})
