import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
server: {
  host: "localhost", // force localhost instead of IPv6
  port: 5173
}

})
