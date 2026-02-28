import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import UserList from './pages/users/UserList';
import FertilizerList from './pages/fertilizers/FertilizerList';
import CropList from './pages/crops/CropList';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public route - Login */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected routes - Admin Panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="fertilizers" element={<FertilizerList />} />
            <Route path="crops" element={<CropList />} />
          </Route>

          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
