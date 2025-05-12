import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserRoutes from '@/routes/UserRoutes';
import AdminRoutes from '@/routes/AdminRoutes';

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
        <Route path="/*" element={<UserRoutes />} />
        
        {/* Admin routes with protection */}
        <Route path="/admin/*" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminRoutes />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;