import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Proceed with client-side logout even if API fails
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token) {
        try {
          // Verify token by fetching user profile
          const response = await fetch(`${API_URL}/api/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setIsAuthenticated(true);
            setUser(userData); // Assuming backend returns the user object directly
            // Update stored user data if it changed
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // Token might be invalid or expired
            if (response.status === 401 || response.status === 403) {
              // Attempt to refresh token if a refresh token endpoint exists and is implemented
              // For now, just log out
              console.warn('Token validation failed, logging out.');
              await logout(); // Use the useCallback version of logout
            } else {
               // Other server error, keep user logged out for safety
               console.error('Failed to fetch profile:', response.statusText);
               await logout();
            }
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          await logout(); // Logout on any error during auth check
        }
      } else if (storedUser) {
        // If no token but stale user data, clear it
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [logout]); // Add logout as a dependency

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user object
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.msg || 'Login failed' };
      }
    } catch (error) {
      console.error('Login API call error:', error);
      return { success: false, message: 'Network error or server unavailable' };
    }
  };

  // Provide loading state for App.js to potentially show a spinner
  if (loading) {
    return <div>Loading application...</div>; // Or a proper spinner component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loadingAuth: loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
