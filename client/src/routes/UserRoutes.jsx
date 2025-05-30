import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import Home from "@/pages/user/Home";
import Tours from "@/pages/user/Tours";
import TourDetail from "@/pages/user/TourDetail";
import About from "@/pages/user/About";
import Contact from "@/pages/user/Contact";
import Login from "@/pages/user/Login";
import Register from "@/pages/user/Register";
import NotFound from "@/pages/not-found";
import Profile from "@/pages/user/Profile";
import Bookings from "@/pages/user/Bookings";
import ForgotPassword from "@/pages/user/ForgotPassword";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:tourId" element={<TourDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="profile" element={<Profile />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
