import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';

// Admin pages
import Dashboard from '@/pages/admin/Dashboard';
import ManageTours from '@/pages/admin/ManageTours';
import ManageUsers from '@/pages/admin/ManageUsers';
import ManageBookings from '@/pages/admin/ManageBookings';
import ManageReviews from '@/pages/admin/ManageReviews';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<ManageTours />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="reviews" element={<ManageReviews />} />
      </Route>
    </Routes>
  );
}