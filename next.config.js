/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    CHAT_API_URL: process.env.CHAT_API_URL,
  }
};

module.exports = nextConfig;
