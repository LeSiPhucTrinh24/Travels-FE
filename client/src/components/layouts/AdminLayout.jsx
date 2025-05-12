import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Map, 
  Users, 
  BookOpen, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Menu items for the sidebar
const menuItems = [
  { 
    icon: BarChart3, 
    label: 'Dashboard',
    href: '/admin',
  },
  { 
    icon: Map, 
    label: 'Tours',
    href: '/admin/tours',
  },
  { 
    icon: BookOpen, 
    label: 'Bookings',
    href: '/admin/bookings',
  },
  { 
    icon: Users, 
    label: 'Users',
    href: '/admin/users',
  },
  { 
    icon: MessageSquare, 
    label: 'Reviews',
    href: '/admin/reviews',
  },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Handle logout
  const handleLogout = () => {
    // Giả lập đăng xuất và chuyển hướng về trang login
    console.log('Logging out...');
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside 
        className={`bg-white border-r border-gray-200 w-64 fixed inset-y-0 left-0 z-30 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link 
            to="/admin" 
            className="flex items-center"
          >
            <span className="text-xl font-bold text-primary">TravelNow</span>
            <span className="ml-2 text-sm font-medium text-gray-600">Admin</span>
          </Link>
          
          <button 
            className="p-1 rounded-md lg:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="py-4 flex flex-col h-[calc(100%-4rem)] justify-between">
          <nav className="px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-md ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'} mr-3`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="px-4 mt-auto">
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3 text-gray-500" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Navbar */}
        <header className="bg-white shadow-sm z-10 h-16">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            {/* Mobile sidebar toggle */}
            <button 
              className="p-1 rounded-md lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            
            {/* Profile and notifications */}
            <div className="flex items-center ml-auto">
              {/* User profile dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">Admin</span>
                  <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      to="/admin/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Hồ sơ
                    </Link>
                    <Link 
                      to="/admin/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Cài đặt
                    </Link>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;