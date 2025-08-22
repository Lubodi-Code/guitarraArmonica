import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
// no node 'path' import to keep config TS-friendly in browser-like toolchains

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      // Vite resolves leading-slash paths to project root, so this avoids importing Node 'path'
      '@': '/src'
    }
  }
})
