import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './DashbaordLayout'
import Dashboard from './pages/Home';
import reservations from './pages/Reservations';

import Customers from './pages/Customers';
import Help from './pages/Help';
import Reservations from './pages/Reservations';

function App() {
  // Start with null to indicate "checking authentication"
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    // If we have both token and username, consider authenticated
    if (token && username) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Login setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="reservations" element={<Reservations />} />
        
        <Route path="customers" element={<Customers />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;