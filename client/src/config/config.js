// Configuration for different environments
const config = {
  development: {
    apiBaseURL: "http://localhost:5000",
    environment: "development",
  },
  production: {
    apiBaseURL: "https://formtask-dixz.onrender.com", // Replace with your actual Render URL
    environment: "production",
  },
};

// Get current environment
const currentEnv = process.env.NODE_ENV || "development";

// Export configuration
export const API_BASE_URL = config[currentEnv].apiBaseURL;
export const ENVIRONMENT = config[currentEnv].environment;

// API endpoints
export const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/api/categories`,
  properties: `${API_BASE_URL}/api/properties`,
  propertyById: (id) => `${API_BASE_URL}/api/properties/${id}`,
};
