/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Silence Turbopack/webpack conflict warning in Next.js 16
  turbopack: {},
  // pdfjs-dist: disable canvas/encoding for webpack production builds
  // https://github.com/mozilla/pdf.js/issues/16214
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
