// Helper function to build API URL
const buildApiUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || 'https://quizgen-4okk.onrender.com';
  // Ensure the URL ends with /api
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = buildApiUrl();

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
    const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
    console.log('Making API request to:', url);
    
    const response = await fetch(url, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      setAuthToken(null);
      throw new Error('Invalid email or password');
    }

    const data = await response.json();
    
    if (!response.ok) {
      // Return the error response instead of throwing
      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
        status: response.status
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    console.error('API Base URL:', API_BASE_URL);
    console.error('Environment:', import.meta.env.MODE);
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

  // Get assigned quiz for taking (with validation)
  getAssignedQuiz: async (quizId) => {
    return await apiRequest(`/quiz/assigned/${quizId}`);
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

  // Get user's assigned quizzes
  getAssignedQuizzes: async () => {
    return await apiRequest('/quiz/assigned');
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

  // Assign quiz to users
  assignQuiz: async (quizId, assignmentData) => {
    return await apiRequest(`/quiz/${quizId}/assign`, {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  // Get assignment results
  getAssignmentResults: async () => {
    return await apiRequest('/quiz/assignments/results');
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