import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/norkart-workshop-React-CICD/',
  server: {
    port: 3000,
    host: 'localhost'
  },
  plugins: [react()],
});
