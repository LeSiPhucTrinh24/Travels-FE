import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";

const AuthContext = createContext();

// Separate component to handle navigation and toast
const AuthProviderContent = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Validate token and refresh if needed
  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      // Allow access to login and register pages without token
      if (!location.pathname.includes("/login") && !location.pathname.includes("/register") && !location.pathname.includes("/forgot-password")) {
        navigate("/login");
      }
      return;
    }

    try {
      // Try to get user info to validate token
      const response = await axiosInstance.get("/users/myInfo");
      const userData = response.data.result;

      // Update user state with fresh data
      const updatedUser = {
        id: userData.userId,
        name: userData.fullName,
        userName: userData.userName,
        phone: userData.phone,
        address: userData.address,
        dob: userData.dob,
        avatar: userData.avatar,
        roles: userData.roles || [],
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Check admin access
      if (location.pathname.startsWith("/admin")) {
        if (!hasRole(updatedUser.roles, "admin")) {
          // If user is not admin, redirect to home
          toast({
            variant: "destructive",
            title: "Không có quyền truy cập",
            description: "Bạn không có quyền truy cập trang quản trị",
          });
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      // Clear invalid token and user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      // Allow access to login and register pages without token
      if (!location.pathname.includes("/login") && !location.pathname.includes("/register") && !location.pathname.includes("/forgot-password")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, [location.pathname]); // Re-validate when path changes

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Missing token or userId");
      }

      // Call logout API with LogoutRequest structure
      await axiosInstance.post(
        "/auth/logout",
        {
          userId: parseInt(userId), // Convert userId to number if backend expects it
          token: token, // Include token in request body if needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Clear local storage and state
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // Show success message
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống",
      });

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, still clear local data
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");

      toast({
        variant: "destructive",
        title: "Lỗi đăng xuất",
        description: "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại sau.",
      });
    }
  };

  // Utility functions for role checking
  const hasRole = (roles, role) => {
    if (!roles || !Array.isArray(roles)) return false;
    return roles.some((r) => r.toLowerCase() === role.toLowerCase());
  };

  const isAdmin = () => hasRole(user?.roles, "admin");
  const isUser = () => hasRole(user?.roles, "user");

  // Function to check if user has required role
  const requireRole = (role) => {
    if (!user) {
      navigate("/login");
      return false;
    }
    if (!hasRole(user.roles, role)) {
      toast({
        variant: "destructive",
        title: "Không có quyền truy cập",
        description: "Bạn không có quyền truy cập trang này",
      });
      navigate("/");
      return false;
    }
    return true;
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    hasRole,
    isAdmin,
    isUser,
    requireRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Wrapper component that doesn't use hooks
export const AuthProvider = ({ children }) => {
  return <AuthProviderContent>{children}</AuthProviderContent>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
