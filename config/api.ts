// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://192.168.100.11:5000/api",
  ENDPOINTS: {
    ORDERS: "/orders",
    USERS: "/users",
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  const code = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log("code", code);
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
