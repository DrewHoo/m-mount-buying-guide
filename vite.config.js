import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/m-mount-buying-guide/',
  plugins: [react()],
})
