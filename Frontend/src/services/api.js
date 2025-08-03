const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Base fetch function with automatic token handling
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`, config);
    ;
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      setAuthToken(null);
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register new user
  signup: async (userData) => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Get user profile
  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Logout
  logout: () => {
    setAuthToken(null);
  },
};

// Quiz API
export const quizAPI = {
  // Get public quizzes
  getPublicQuizzes: async () => {
    return await apiRequest('/quiz/public');
  },

  // Get specific quiz
  getQuiz: async (quizId) => {
    return await apiRequest(`/quiz/${quizId}`);
  },

  // Create new quiz
  createQuiz: async (quizData) => {
    return await apiRequest('/quiz', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  // Get user's created quizzes
  getUserQuizzes: async () => {
    return await apiRequest('/quiz/user/created');
  },

  // Update quiz
  updateQuiz: async (quizId, quizData) => {
    return await apiRequest(`/quiz/${quizId}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    });
  },

  // Delete quiz
  deleteQuiz: async (quizId) => {
    return await apiRequest(`/quiz/${quizId}`, {
      method: 'DELETE',
    });
  },

  // Submit quiz answers
  submitQuiz: async (quizId, answers) => {
    return await apiRequest(`/quiz/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  },
};

// User API
export const userAPI = {
  // Get user statistics
  getUserStats: async () => {
    return await apiRequest('/user/stats');
  },

  // Get quiz history
  getQuizHistory: async () => {
    return await apiRequest('/user/history');
  },

  // Get created quizzes
  getCreatedQuizzes: async () => {
    return await apiRequest('/user/created-quizzes');
  },

  // Get leaderboard
  getLeaderboard: async () => {
    return await apiRequest('/user/leaderboard');
  },

  // Deactivate account
  deactivateAccount: async () => {
    return await apiRequest('/user/deactivate', {
      method: 'POST',
    });
  },
};

export { getAuthToken, setAuthToken }; 