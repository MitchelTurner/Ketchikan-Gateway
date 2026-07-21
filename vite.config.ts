import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'ktn_logo.png',
        'ktn_logo-192.png',
        'apple-touch-icon.png',
        'ship_visits.json',
      ],
      manifest: {
        name: 'KTN Port',
        short_name: 'KTN Port',
        description:
          'Daily cruise passenger forecasts for Ketchikan, cross-referenced with weather.',
        theme_color: '#16352f',
        background_color: '#f4f7f8',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        shortcuts: [
          {
            name: 'Today',
            short_name: 'Today',
            description: 'Should I go downtown right now?',
            url: '/',
            icons: [{ src: '/ktn_logo-192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Tomorrow',
            short_name: 'Tomorrow',
            description: 'Tomorrow’s cruise crowd forecast',
            url: '/schedule/tomorrow',
            icons: [{ src: '/ktn_logo-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        icons: [
          {
            src: '/ktn_logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/ktn_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,json,ico,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.hostname.includes('open-meteo.com') ||
              url.hostname.includes('coderick.net') ||
              url.hostname.includes('tidesandcurrents.noaa.gov'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ktn-port-api-cache',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 6 },
            },
          },
        ],
      },
    }),
  ],
})
