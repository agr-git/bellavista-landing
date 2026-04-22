/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a minimal .next/standalone/ server.js + node_modules subset.
  // Required for the slim Docker image in ./Dockerfile.
  output: "standalone",
};

export default nextConfig;
