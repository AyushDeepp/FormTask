const API_CONFIG = {
  development: {
    baseURL: "http://localhost:5000",
  },
  production: {
    baseURL:
      process.env.REACT_APP_API_URL || "https://formtask-dixz.onrender.com",
  },
};

const currentEnv = process.env.NODE_ENV || "development";
export const API_BASE_URL = API_CONFIG[currentEnv].baseURL;

export const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/api/categories`,
  properties: `${API_BASE_URL}/api/properties`,
  propertyById: (id) => `${API_BASE_URL}/api/properties/${id}`,
};
