import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getAuthToken } from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getAuthToken();
      
      if (token) {
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            setUser(response.data.user);
          } else {
            // Token is invalid, clear it
            authAPI.logout();
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          authAPI.logout();
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.signup(userData);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.message || 'Signup failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      setError(error.message || 'Signup failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setError(null);
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.message || 'Profile update failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      setError(error.message || 'Profile update failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.changePassword(passwordData);
      
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Password change failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      setError(error.message || 'Password change failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 