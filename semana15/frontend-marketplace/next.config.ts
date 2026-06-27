import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de rendimiento en desarrollo
  typescript: {
    tsconfigPath: './tsconfig.json'
  },
  
  // Usar SWC para compilación rápida (default en Next.js 13+)
  swcMinify: true,
  
  // Desabilitar source maps en desarrollo para compilación más rápida
  productionBrowserSourceMaps: false,
  
  // Optimizar imágenes
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp']
  },
  
  // Reducir tamaño bundle
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minuto
    pagesBufferLength: 5, // Menos páginas cacheadas
  },
  
  // Reducir watch de archivos
  watchPathIgnorePatterns: ['node_modules', '.git', '.next']
};

export default nextConfig;
