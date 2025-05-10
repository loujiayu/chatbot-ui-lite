/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    CHAT_API_URL: process.env.CHAT_API_URL,
  },
  // This allows the app to be accessible from other devices on the network
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
};

module.exports = nextConfig;
