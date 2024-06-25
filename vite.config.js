import * as path from 'path';

const config = {
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
      entry: path.resolve(__dirname, 'src/mysystem.js'),
      formats: ['es'],
      fileName: 'mysystem'
    }
  }
}

export default config;