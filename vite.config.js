import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './src/lib/websocket-server';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	server: {
		port: 2137
	}
});
