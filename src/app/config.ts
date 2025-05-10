// Configuration values for different environments

const isProd = process.env.NODE_ENV === 'production';
// Check if we're running in network mode (can be accessed from other devices)
const isNetworkMode = process.env.NEXT_PUBLIC_NETWORK_MODE === 'true';
// Get the local network IP for network mode
const LOCAL_IP = isNetworkMode ? process.env.NEXT_PUBLIC_LOCAL_IP || '192.168.50.99' : 'localhost';

export const API_CONFIG = {
  BASE_URL: isProd 
    ? 'https://vikimt-85352025976.us-central1.run.app' 
    : `http://${LOCAL_IP}:8000`,
  // Remove any trailing slash to ensure proper URL construction
  CHAT_API_URL: isProd ? 'https://vikimt-85352025976.us-central1.run.app' : `http://${LOCAL_IP}:8000`,
};

export default API_CONFIG;
