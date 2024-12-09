import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/',
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Place dynamically imported components in separate chunks
                    if (id.includes('node_modules')) {
                        return 'vendor'; // Dependencies
                    }
                },
            },
        },
    },
});
