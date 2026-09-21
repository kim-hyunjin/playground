import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		// chart.js v3 is CommonJS in Node; bundle it so its named exports resolve during SSR
		noExternal: ['chart.js', 'chartjs-adapter-luxon']
	}
});
