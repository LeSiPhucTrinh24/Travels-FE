import { Routes, Route } from 'react-router-dom';

// Import user pages here
import Home from '@/pages/user/Home';
import Tours from '@/pages/user/Tours';
import TourDetail from '@/pages/user/TourDetail';
import Bookings from '@/pages/user/Bookings';
import About from '@/pages/user/About';
import Contact from '@/pages/user/Contact';
import NotFound from '@/pages/not-found';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetail />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Fallback to 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;