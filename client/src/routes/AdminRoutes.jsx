import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components for better performance
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const ManageTours = lazy(() => import('@/pages/admin/ManageTours'));
const ManageUsers = lazy(() => import('@/pages/admin/ManageUsers'));
const ManageBookings = lazy(() => import('@/pages/admin/ManageBookings'));
const ManageReviews = lazy(() => import('@/pages/admin/ManageReviews'));
const Reports = lazy(() => import('@/pages/admin/Reports'));
const Settings = lazy(() => import('@/pages/admin/Settings'));
const NotFound = lazy(() => import('@/pages/not-found'));

// Loading component
const PageLoader = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const AdminRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tours" element={<ManageTours />} />
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/bookings" element={<ManageBookings />} />
        <Route path="/reviews" element={<ManageReviews />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;