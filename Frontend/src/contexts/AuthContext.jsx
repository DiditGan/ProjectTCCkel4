import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const API_BASE_URL = 'http://localhost:5000'; // Ensure this is the correct base URL for your API

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for user in localStorage on initial load
    const checkUserAuth = () => {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
      setLoading(false);
    };
    
    checkUserAuth();
  }, []);
  
  // Login function
  const login = async (email, password) => {
    try {
      console.log("Attempting to login with email:", email);
      
      // Try to fetch from API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login gagal');
      }
      
      const data = await response.json();
      
      // Store tokens and user data
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      console.log("Attempting to register with data:", userData);
      
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.msg || 'Registration failed');
        }
        
        return data;
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    // Clear all auth data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };
  
  // Update user data function
  const updateUserData = (newUserData) => {
    if (newUserData) {
      setCurrentUser(newUserData); 
      localStorage.setItem('currentUser', JSON.stringify(newUserData));
    } else {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
    }
  };
  
  // Add deleteAccount function
  const deleteAccount = async (password) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/deleteAccount`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to delete account');
      }

      // After successful deletion, logout the user
      await logout();
      return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
      console.error('Account deletion error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUserData,
    deleteAccount, // Add deleteAccount to the context value
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
