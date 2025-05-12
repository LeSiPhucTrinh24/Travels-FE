import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Map, 
  Users, 
  BookOpen, 
  Star, 
  BarChart2, 
  Settings,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if path is active
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };
  
  // Navigation items
  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Quản lý tour', href: '/admin/tours', icon: Map },
    { name: 'Quản lý người dùng', href: '/admin/users', icon: Users },
    { name: 'Quản lý đơn hàng', href: '/admin/bookings', icon: BookOpen },
    { name: 'Quản lý đánh giá', href: '/admin/reviews', icon: Star },
    { name: 'Báo cáo', href: '/admin/reports', icon: BarChart2 },
    { name: 'Cài đặt', href: '/admin/settings', icon: Settings },
  ];
  
  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    navigate('/login');
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for desktop */}
      <div 
        className={`fixed inset-y-0 left-0 flex flex-col z-40 transition-all duration-300 ease-in-out bg-gray-800 text-white md:relative ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div className="flex items-center">
            {isSidebarOpen ? (
              <span className="text-xl font-bold">TravelNow Admin</span>
            ) : (
              <span className="text-xl font-bold">TN</span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:block p-1 rounded-md text-gray-400 hover:text-white focus:outline-none"
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href) 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-3 h-6 w-6 ${isSidebarOpen ? '' : 'mx-auto'}`} />
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
              isSidebarOpen ? 'w-full' : 'justify-center'
            }`}
          >
            <LogOut className={`h-6 w-6 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Search */}
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full max-w-2xl relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Tìm kiếm..."
                  type="search"
                />
              </div>
            </div>
            
            {/* Profile dropdown */}
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification dropdown */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 relative">
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                  3
                </span>
                <Bell className="h-6 w-6" />
              </button>
              
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <span className="ml-2 hidden md:block font-medium text-gray-700">Admin</span>
                    <ChevronDown className="ml-1 hidden md:block h-4 w-4 text-gray-400" />
                  </button>
                </div>
                
                {isProfileMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Hồ sơ của bạn
                    </Link>
                    <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Cài đặt
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;