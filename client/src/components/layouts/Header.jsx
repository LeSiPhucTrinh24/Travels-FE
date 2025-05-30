// src/components/layout/Header.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, ChevronDown, User, History, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";

const Header = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();

  // Fetch user avatar
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (user) {
        try {
          const response = await axiosInstance.get("/users/myInfo");
          setUserAvatar(response.data.result.avatar);
        } catch (error) {
          console.error("Error fetching user avatar:", error);
        }
      }
    };
    fetchUserAvatar();
  }, [user]);

  const isActive = (path) => {
    return path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });

    setProfileOpen(false);

    setTimeout(() => {
      logout();
      navigate("/login");
    }, 1000);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (profileOpen && !e.target.closest(".profile-dropdown")) {
      setProfileOpen(false);
    }
  };

  // Add event listener for clicking outside
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileOpen]);

  const renderUserMenu = () => {
    if (isAdmin()) {
      return (
        <>
          <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <User className="w-4 h-4 mr-2" />
            Quản lý hệ thống
          </Link>
        </>
      );
    }
    return (
      <>
        <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <User className="w-4 h-4 mr-2" />
          Thông tin cá nhân
        </Link>
        <Link to="/bookings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <History className="w-4 h-4 mr-2" />
          Lịch sử đặt tour
        </Link>
      </>
    );
  };

  const userNavItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/tours", label: "Tour du lịch" },
    { path: "/about", label: "Về chúng tôi" },
    { path: "/contact", label: "Liên hệ" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex-shrink-0 mr-10">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">TravelNow</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {userNavItems.map(({ path, label }) => (
              <Link key={path} to={path} className={`text-sm font-medium hover:text-primary transition-colors ${isActive(path) ? "text-primary" : "text-gray-600"}`}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center ml-auto">
            {user ? (
              <div className="relative profile-dropdown">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-3 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  <img src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}`} alt={user.name || "User"} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                  <span>{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1">
                    {renderUserMenu()}
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button>
                  <LogIn className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
