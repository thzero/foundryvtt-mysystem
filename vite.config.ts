import * as path from 'path';

import type { UserConfig } from 'vite';
const config: UserConfig = {
	publicDir: "public",
	base: '/systems/mysystem/',
	root: 'src/',
	server: {
		port: 30001,
		open: "http://localhost:30001/game",
		proxy: {
				"^(?!/systems/mysystem)": "http://localhost:30000/",
				"/socket.io": {
						target: "ws://localhost:30000",
						ws: true,
				}
		}
	},
	build: {
		outDir: path.resolve(__dirname, 'dist'),
		emptyOutDir: true,
		sourcemap: true,
		lib: {
			name: 'mysystem',
			entry: path.resolve(__dirname, 'src/mysystem.ts'),
			formats: ['es'],
			fileName: 'mysystem'
		}
	},
	esbuild: {
		minifyIdentifiers: false,
		keepNames: true
	},
	define: {
	  "process.env": process.env
	}
}

export default config;