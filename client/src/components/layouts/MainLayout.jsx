import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  Search, 
  LogIn, 
  ChevronDown,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if the current route is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar with contact info */}
      <div className="bg-primary text-white text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>Hotline: 0123 456 789</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>Email: contact@travelnow.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-white/80">Đăng nhập</Link>
            <Link to="/register" className="hover:text-white/80">Đăng ký</Link>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-primary">
                <span className="text-secondary">Travel</span>Now
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`text-gray-700 hover:text-primary font-medium ${isActive('/') ? 'text-primary' : ''}`}
              >
                Trang chủ
              </Link>
              <Link 
                to="/tours" 
                className={`text-gray-700 hover:text-primary font-medium ${isActive('/tours') ? 'text-primary' : ''}`}
              >
                Tours
              </Link>
              <Link 
                to="/about" 
                className={`text-gray-700 hover:text-primary font-medium ${isActive('/about') ? 'text-primary' : ''}`}
              >
                Giới thiệu
              </Link>
              <Link 
                to="/contact" 
                className={`text-gray-700 hover:text-primary font-medium ${isActive('/contact') ? 'text-primary' : ''}`}
              >
                Liên hệ
              </Link>
              <div className="relative">
                <button 
                  className="flex items-center text-gray-700 hover:text-primary font-medium"
                  onClick={toggleUserMenu}
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>Tài khoản</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                
                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
                    <Link 
                      to="/account" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Thông tin tài khoản
                    </Link>
                    <Link 
                      to="/bookings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đặt tour của tôi
                    </Link>
                    <div className="border-t my-1"></div>
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng nhập
                    </Link>
                  </div>
                )}
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-primary"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className={`text-gray-700 hover:text-primary py-2 ${isActive('/') ? 'text-primary font-medium' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link 
                  to="/tours" 
                  className={`text-gray-700 hover:text-primary py-2 ${isActive('/tours') ? 'text-primary font-medium' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tours
                </Link>
                <Link 
                  to="/about" 
                  className={`text-gray-700 hover:text-primary py-2 ${isActive('/about') ? 'text-primary font-medium' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Giới thiệu
                </Link>
                <Link 
                  to="/contact" 
                  className={`text-gray-700 hover:text-primary py-2 ${isActive('/contact') ? 'text-primary font-medium' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Liên hệ
                </Link>
                <div className="border-t pt-2">
                  <Link 
                    to="/account" 
                    className="flex items-center text-gray-700 hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span>Thông tin tài khoản</span>
                  </Link>
                  <Link 
                    to="/bookings" 
                    className="flex items-center text-gray-700 hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Đặt tour của tôi</span>
                  </Link>
                </div>
                <div className="border-t pt-2 flex space-x-4">
                  <Link 
                    to="/login" 
                    className="flex items-center text-gray-700 hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    <span>Đăng nhập</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center text-gray-700 hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Đăng ký</span>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TravelNow</h3>
              <p className="text-gray-300 mb-4">
                Chúng tôi cung cấp những tour du lịch chất lượng cao với giá cả hợp lý, 
                mang đến cho khách hàng những trải nghiệm tuyệt vời nhất.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-primary">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-primary">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-primary">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.039 10.039 0 01-3.127 1.195 4.927 4.927 0 00-8.391 4.492 13.98 13.98 0 01-10.15-5.149 4.927 4.927 0 001.525 6.572 4.91 4.91 0 01-2.232-.616v.062a4.925 4.925 0 003.947 4.828 4.897 4.897 0 01-2.225.084 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.101 2.105 9.98 9.98 0 01-1.17-.067 13.916 13.916 0 007.54 2.212c9.054 0 14.004-7.5 14.004-14.001 0-.213-.005-.426-.015-.637a10.068 10.068 0 002.453-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-primary">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Tour phổ biến</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/tours" className="text-gray-300 hover:text-white">Tour Hạ Long</Link>
                </li>
                <li>
                  <Link to="/tours" className="text-gray-300 hover:text-white">Tour Đà Nẵng</Link>
                </li>
                <li>
                  <Link to="/tours" className="text-gray-300 hover:text-white">Tour Phú Quốc</Link>
                </li>
                <li>
                  <Link to="/tours" className="text-gray-300 hover:text-white">Tour Đà Lạt</Link>
                </li>
                <li>
                  <Link to="/tours" className="text-gray-300 hover:text-white">Tour Sapa</Link>
                </li>
                <li>
                  <Link to="/tours" className="text-gray-300 hover:text-white">Tour Nha Trang</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên kết hữu ích</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white">Về chúng tôi</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white">Liên hệ</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white">Điều khoản sử dụng</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-white">Chính sách bảo mật</Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-gray-300 hover:text-white">Câu hỏi thường gặp</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-300 mr-2 mt-0.5" />
                  <span className="text-gray-300">123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-300 mr-2" />
                  <span className="text-gray-300">0123 456 789</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-300 mr-2" />
                  <span className="text-gray-300">contact@travelnow.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm">
                © {new Date().getFullYear()} TravelNow. Tất cả các quyền được bảo lưu.
              </p>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-4">
                  <li>
                    <Link to="/terms" className="text-gray-300 hover:text-white text-sm">Điều khoản</Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">Bảo mật</Link>
                  </li>
                  <li>
                    <Link to="/cookies" className="text-gray-300 hover:text-white text-sm">Cookies</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;