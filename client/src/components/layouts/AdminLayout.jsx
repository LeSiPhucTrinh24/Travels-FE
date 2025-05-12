import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart2, 
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Bell,
  User
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  
  // Nav items
  const navItems = [
    { path: '/admin', icon: <Home className="h-5 w-5" />, label: 'Tổng quan' },
    { path: '/admin/tours', icon: <Map className="h-5 w-5" />, label: 'Quản lý Tour' },
    { path: '/admin/bookings', icon: <Calendar className="h-5 w-5" />, label: 'Đặt tour' },
    { path: '/admin/users', icon: <Users className="h-5 w-5" />, label: 'Người dùng' },
    { path: '/admin/reviews', icon: <MessageSquare className="h-5 w-5" />, label: 'Đánh giá' },
    { path: '/admin/reports', icon: <BarChart2 className="h-5 w-5" />, label: 'Báo cáo' },
    { path: '/admin/settings', icon: <Settings className="h-5 w-5" />, label: 'Cài đặt' },
  ];
  
  // Check if a path is active
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  // Sample notifications
  const notifications = [
    { id: 1, title: 'Đặt tour mới', message: 'Nguyễn Văn A đã đặt tour Vịnh Hạ Long', time: '5 phút trước' },
    { id: 2, title: 'Đánh giá mới', message: 'Đánh giá mới từ Trần Thị B cần được duyệt', time: '30 phút trước' },
    { id: 3, title: 'Thanh toán thành công', message: 'Đơn hàng #123 đã thanh toán thành công', time: '1 giờ trước' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-semibold text-primary">
              <span className="text-secondary">Travel</span>Now
            </span>
          </Link>
          <button 
            className="p-1 text-gray-500 rounded-md lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-md ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Sidebar footer */}
        <div className="absolute bottom-0 w-full p-4 border-t space-y-2">
          <div className="flex items-center px-3 py-3 rounded-md bg-gray-50">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin Name</p>
              <p className="text-xs text-gray-500">admin@travelnow.com</p>
            </div>
          </div>
          <Link 
            to="/"
            className="flex items-center justify-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Đăng xuất</span>
          </Link>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center z-10 sticky top-0">
          <div className="container mx-auto px-6 flex items-center justify-between">
            {/* Mobile menu button */}
            <button 
              className="p-1 text-gray-500 rounded-md lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center ml-auto space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 relative"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 border">
                    <div className="px-4 py-2 border-b">
                      <h3 className="text-sm font-semibold">Thông báo</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className="px-4 py-3 hover:bg-gray-50 border-b last:border-0"
                        >
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-400">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t text-center">
                      <Link to="/admin/notifications" className="text-xs text-primary font-medium">
                        Xem tất cả thông báo
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User menu */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="hidden md:block font-medium text-sm">Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
                    <Link 
                      to="/admin/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Thông tin tài khoản
                    </Link>
                    <Link 
                      to="/admin/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cài đặt
                    </Link>
                    <div className="border-t my-1"></div>
                    <Link 
                      to="/" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="container mx-auto px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;