export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  future: { compatibilityVersion: 4 },

  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],

  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],

  runtimeConfig: {
    seekrApiKey: process.env.SEEKR_API_KEY,
    seekrTeamId: process.env.SEEKR_TEAM_ID,
    public: {}
  },

  app: {
    head: {
      title: "SensAI",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "AI-powered event discovery and itinerary planner" }
      ],
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        }
      ]
    }
  },

  css: ["~/assets/css/main.css"]
});
