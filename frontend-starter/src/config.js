const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'
};

export default config; 