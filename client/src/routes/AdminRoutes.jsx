import { Routes, Route } from 'react-router-dom';

// Import admin pages here
import Dashboard from '@/pages/admin/Dashboard';
import ManageTours from '@/pages/admin/ManageTours';
import ManageUsers from '@/pages/admin/ManageUsers';
import ManageBookings from '@/pages/admin/ManageBookings';
import ManageReviews from '@/pages/admin/ManageReviews';
import Reports from '@/pages/admin/Reports';
import Settings from '@/pages/admin/Settings';
import NotFound from '@/pages/not-found';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tours" element={<ManageTours />} />
      <Route path="/users" element={<ManageUsers />} />
      <Route path="/bookings" element={<ManageBookings />} />
      <Route path="/reviews" element={<ManageReviews />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Fallback to 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;