import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components for better performance
const Home = lazy(() => import('@/pages/user/Home'));
const TourDetail = lazy(() => import('@/pages/user/TourDetail'));
const Tours = lazy(() => import('@/pages/user/Tours'));
const About = lazy(() => import('@/pages/user/About'));
const Contact = lazy(() => import('@/pages/user/Contact'));
const Login = lazy(() => import('@/pages/user/Login'));
const Register = lazy(() => import('@/pages/user/Register'));
const NotFound = lazy(() => import('@/pages/not-found'));

// Loading component
const PageLoader = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const UserRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;