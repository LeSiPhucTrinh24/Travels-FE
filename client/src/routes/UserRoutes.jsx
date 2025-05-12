import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';

// User pages
import Home from '@/pages/user/Home';
import Tours from '@/pages/user/Tours';
import TourDetail from '@/pages/user/TourDetail';
import About from '@/pages/user/About';
import Contact from '@/pages/user/Contact';
import Login from '@/pages/user/Login';
import NotFound from '@/pages/not-found';

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:id" element={<TourDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}