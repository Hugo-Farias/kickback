import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

var vite_config = defineConfig({
  plugins: [react(), crx({manifest, browser: "chrome"})]
});

export { vite_config as default };
