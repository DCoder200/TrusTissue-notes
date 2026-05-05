import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        warningFilter: (warning) => {
          return !warning.code?.startsWith('a11y');
        }
      }
    })
  ]
});