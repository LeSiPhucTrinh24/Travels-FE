import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import AdminLayout from '@/components/layouts/AdminLayout';

// User pages
import Home from '@/pages/user/Home';
import Tours from '@/pages/user/Tours';
import TourDetail from '@/pages/user/TourDetail';
import About from '@/pages/user/About';
import Contact from '@/pages/user/Contact';
import Login from '@/pages/user/Login';
import Register from '@/pages/user/Register';
import NotFound from '@/pages/not-found';

// Admin pages
import Dashboard from '@/pages/admin/Dashboard';
import ManageTours from '@/pages/admin/ManageTours';
import ManageUsers from '@/pages/admin/ManageUsers';
import ManageBookings from '@/pages/admin/ManageBookings';
import ManageReviews from '@/pages/admin/ManageReviews';

const App = () => {
  // Mock authentication state
  const isAuthenticated = true; // Set to false to test authentication flow
  const isAdmin = true; // Set to false to test admin route guard
  
  // Protected route component
  const ProtectedRoute = ({ children, requireAdmin }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (requireAdmin && !isAdmin) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };
  
  return (
    <Router>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/tours" element={<MainLayout><Tours /></MainLayout>} />
        <Route path="/tours/:id" element={<MainLayout><TourDetail /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/tours" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <ManageTours />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <ManageUsers />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <ManageBookings />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <ManageReviews />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default App;