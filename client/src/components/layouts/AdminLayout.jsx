import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X,
  ChevronDown, 
  LogOut,
  User,
  Home,
  Map,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Mail,
  Bell
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  
  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Tổng quan', path: '/admin' },
    { icon: <Map className="h-5 w-5" />, label: 'Quản lý Tour', path: '/admin/tours' },
    { icon: <Users className="h-5 w-5" />, label: 'Quản lý người dùng', path: '/admin/users' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Quản lý đặt tour', path: '/admin/bookings' },
    { icon: <FileText className="h-5 w-5" />, label: 'Quản lý đánh giá', path: '/admin/reviews' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Báo cáo thống kê', path: '/admin/reports' },
    { icon: <Settings className="h-5 w-5" />, label: 'Cài đặt', path: '/admin/settings' },
  ];
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-50 bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-bold">Admin<span className="text-primary">Panel</span></span>
          </Link>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={closeSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="py-4">
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
              <div>
                <div className="font-medium">Admin</div>
                <div className="text-xs text-gray-400">admin@travelnow.com</div>
              </div>
            </div>
          </div>
          
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm hover:bg-gray-800
                    ${isActive(item.path) ? 'bg-gray-800 border-l-4 border-primary pl-3' : ''}
                  `}
                >
                  <span className="mr-3 text-gray-400">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Sidebar footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center text-sm text-gray-400 hover:text-white">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </span>
            <span>Quay về trang chủ</span>
          </Link>
        </div>
      </div>
    </>
  );
};

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      
      {/* Main content */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={openSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Search */}
            <div className="max-w-lg w-full hidden md:block">
              <Input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="w-full"
              />
            </div>
            
            {/* Header right */}
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>
              
              <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Mail className="h-6 w-6" />
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white font-medium">A</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ cá nhân</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link to="/">
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-4 border-t">
          <div className="text-center text-sm text-gray-500">
            &copy; 2025 TravelNow Admin Panel. Bản quyền thuộc về TravelNow.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;