import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: "::",
        port: 8080,
    },
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
                    'ui-vendor': ['lucide-react', 'recharts', 'chart.js'],
                    'supabase-vendor': ['@supabase/supabase-js'],
                }
            }
        }
    }
});
