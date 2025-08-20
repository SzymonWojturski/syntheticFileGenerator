import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // <-- kluczowe dla Electron
  build: {
    outDir: path.resolve(__dirname, 'dist')
  }
})
