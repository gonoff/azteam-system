import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import tsconfigPaths from "vite-tsconfig-paths"
import checker from "vite-plugin-checker"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // React plugin for JSX
    react(),

    // TailwindCSS plugin
    tailwindcss(),

    // SVGR plugin to import SVGs as React components
    svgr({
      exportAsDefault: true,
      svgrOptions: {
        icon: true,
        svgo: true,
      },
    }),

    // Tsconfig paths synchronization
    tsconfigPaths(),

    // Type checking plugin - only using TypeScript checker to avoid ESLint issues
    checker({
      typescript: true,
      // Commenting out ESLint checker due to configuration issues
      // eslint: {
      //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      // },
    }),
  ],

  // Path aliases for imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/ui": path.resolve(__dirname, "./src/components/ui"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/context": path.resolve(__dirname, "./src/context"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/layouts": path.resolve(__dirname, "./src/layouts"),
    },
  },

  // Server configuration
  server: {
    port: 3000,
    open: true,
    host: true, // Listen on all addresses
  },

  // Build optimizations
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "terser",
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-hook-form',
            'zod',
            'date-fns'
          ],
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-tooltip',
          ],
        },
      },
    },
  },
})
