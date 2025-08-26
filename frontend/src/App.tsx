import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout Components
import Layout from './components/layout/Layout';
import Sidebar from './components/layout/Sidebar';

// Page Components
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Appointments from './pages/Appointments';
import Treatments from './pages/Treatments';
import MedicalRecords from './pages/MedicalRecords';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Backup from './pages/Backup';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sf">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main App Routes
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Layout>
  );
};

// Main App Component
const App: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 font-sf antialiased">
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
