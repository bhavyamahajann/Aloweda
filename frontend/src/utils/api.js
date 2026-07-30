// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Auth API functions
export const authAPI = {
  // Sign up new user
  signup: async (name, email, password) => {
    return apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Login user
  login: async (email, password) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get user profile (protected route)
  getProfile: async (token) => {
    return apiCall('/api/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Local storage helpers
export const storage = {
  setToken: (token) => {
    localStorage.setItem('aloweda_token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('aloweda_token');
  },
  
  removeToken: () => {
    localStorage.removeItem('aloweda_token');
  },
  
  setUser: (user) => {
    localStorage.setItem('aloweda_user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('aloweda_user');
    return user ? JSON.parse(user) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem('aloweda_user');
  },
  
  clear: () => {
    storage.removeToken();
    storage.removeUser();
  },
};
