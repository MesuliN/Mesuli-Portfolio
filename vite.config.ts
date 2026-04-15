import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /** So `/about`, `/projects`, etc. resolve to `index.html` in dev and preview. */
  appType: 'spa',
})
