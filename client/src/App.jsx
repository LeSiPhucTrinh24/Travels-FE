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
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tours/:id" element={<TourDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="tours" element={<ManageTours />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="reviews" element={<ManageReviews />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default App;