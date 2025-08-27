const config = {
  development: {
    apiBaseUrl: 'http://localhost:5001/api',
    wsUrl: 'ws://localhost:5001'
  },
  production: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://your-backend-domain.com/api',
    wsUrl: process.env.REACT_APP_WS_URL || 'wss://your-backend-domain.com'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const apiConfig = config[environment];

export default apiConfig;
