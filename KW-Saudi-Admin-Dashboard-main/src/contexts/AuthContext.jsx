// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Check auth on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // ✅ LOGIN with phoneNumber + password
  const login = async (phoneNumber, password) => {
    try {
      console.log('Attempting login with:', phoneNumber); // Debug log
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/login`,
        {
          phoneNumber, // Keep your phone number field
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // This enables cookies
          timeout: 10000 // 10 second timeout
        }
      );

      console.log('Login response:', response.data); // Debug log

      if (response.data.success) {
        const { admin } = response.data;
        
        // Store admin info (cookie is handled by backend)
        localStorage.setItem('admin', JSON.stringify(admin));
        setAdmin(admin);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ REGISTER (only Admin should call this in UI)
  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/register`,
        userData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const { user, token } = response.data;

        // ✅ Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(user));

        // ✅ Extra: store token in cookie
        document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=strict`;

        setAdmin(user);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || 'Registration failed',
        };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGOUT clears both localStorage & cookies
  const logout = async () => {
    try {
      setAdmin(null);
      setIsAuthenticated(false);

      // Clear localStorage
      localStorage.removeItem('admin');
      localStorage.removeItem('token');

      // Clear cookie (set expiry to past)
      document.cookie =
        'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';

      window.location.href = '/pages/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    admin,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };
