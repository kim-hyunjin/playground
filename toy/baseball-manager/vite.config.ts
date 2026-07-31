import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const playersCsv = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/data/players.csv'),
  'utf8',
)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    host: process.env.TAURI_DEV_HOST || '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  define: {
    __PLAYERS_CSV_TEXT__: JSON.stringify(playersCsv),
  },
})
