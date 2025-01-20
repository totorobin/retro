import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    server: {
        proxy: {
            '/socket.io': {
                target: 'ws://localhost:3000',
                ws: true
            },
            '/download': 'http://localhost:3000',
            '/data': 'http://localhost:3000'
        }
    },
    build: {
        commonjsOptions: {include: []}
    }
})
