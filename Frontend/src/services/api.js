import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const logApi = {
  // Ingest a single log entry
  ingestLog: async (logEntry) => {
    try {
      const response = await api.post('/logs', logEntry);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to ingest log entry');
    }
  },

  // Get logs with optional filters
  getLogs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/logs?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch logs');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend server is not responding');
    }
  }
};

export default api; 