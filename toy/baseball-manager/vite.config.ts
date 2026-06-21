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
  define: {
    __PLAYERS_CSV_TEXT__: JSON.stringify(playersCsv),
  },
})
