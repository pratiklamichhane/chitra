import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      worker_threads: false,
    };
    return config;
  },
  turbopack: {},
};

export default nextConfig;
