import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Add this section to stop using 'eval' for source maps
  server: {
    hmr: {
      overlay: false, // Disables the error overlay which sometimes triggers CSP
    }
  },
  build: {
    sourcemap: false, // Prevents generating maps that might use eval
  }
})