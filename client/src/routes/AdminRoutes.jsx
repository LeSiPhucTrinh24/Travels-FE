import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Define admin routes here */}
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<div>Manage Tours</div>} />
        <Route path="users" element={<div>Manage Users</div>} />
        <Route path="bookings" element={<div>Manage Bookings</div>} />
        <Route path="reviews" element={<div>Manage Reviews</div>} />
      </Route>
    </Routes>
  );
}