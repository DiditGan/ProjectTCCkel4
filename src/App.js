import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginPage from './pages/LoginPage'; // Import LoginPage
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider and useAuth
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './App.css';

// A small component to handle the main layout including Navbar and Footer
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="main-content container"> {/* Added container class for consistent padding/width */}
        {children}
      </main>
      <Footer />
    </>
  );
};

// Component to decide whether to show login or the app based on auth status
// This helps in not showing Navbar/Footer on the login page if desired,
// or to have a different layout for login.
// For simplicity, LoginPage will also be wrapped by MainLayout for now,
// but this can be adjusted.
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout><Home /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <MainLayout><Products /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/about" 
        element={
          <ProtectedRoute>
            <MainLayout><About /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contact" 
        element={
          <ProtectedRoute>
            <MainLayout><Contact /></MainLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route - redirect to home if authenticated, else to login */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
