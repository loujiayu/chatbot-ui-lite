// Configuration values for different environments

const isProd = process.env.NODE_ENV === 'production';

export const API_CONFIG = {
  BASE_URL: isProd 
    ? 'https://vikimt-85352025976.us-central1.run.app' 
    : 'http://localhost:8000',
  // Remove any trailing slash to ensure proper URL construction
  CHAT_API_URL: isProd ? 'https://vikimt-85352025976.us-central1.run.app' : 'http://localhost:8000',
};

export default API_CONFIG;
