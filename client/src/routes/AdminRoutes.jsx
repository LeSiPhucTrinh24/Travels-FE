import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AdminTours from "@/pages/admin/AdminTours";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminDestinations from "@/pages/admin/AdminDestinations";
import AdminItineraries from "@/pages/admin/AdminItineraries";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminUserForm from "@/pages/admin/AdminUserForm";
import AdminTourForm from "@/pages/admin/AdminTourForm";
import AdminTourImageForm from "@/pages/admin/AdminTourImageForm";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminReviews from "@/pages/admin/AdminReviews";
import Reports from "@/pages/admin/Reports";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<AdminTours />} />
        <Route path="tours/add" element={<AdminTourForm />} />
        <Route path="tours/edit/:tourId" element={<AdminTourForm isEditing />} />
        <Route path="tours/:id/images" element={<AdminTourImageForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="itineraries" element={<AdminItineraries />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/add" element={<AdminUserForm />} />
        <Route path="users/edit/:id" element={<AdminUserForm isEditing />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
