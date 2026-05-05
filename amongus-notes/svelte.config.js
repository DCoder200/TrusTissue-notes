import { svelte } from '@sveltejs/vite-plugin-svelte';

export default {
  plugins: [
    svelte({
      onwarn: (warning, handler) => {
        if (warning.code && warning.code.startsWith('a11y')) return;
        handler(warning);
      }
    })
  ]
};
