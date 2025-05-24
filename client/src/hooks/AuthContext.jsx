import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext();

// Separate component to handle navigation and toast
const AuthProviderContent = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống",
    });
  };

  // Utility functions for role checking
  const hasRole = (role) => {
    if (!user?.roles || !Array.isArray(user.roles)) return false;
    return user.roles.some((r) => r.toLowerCase() === role.toLowerCase());
  };

  const isAdmin = () => hasRole("admin");
  const isUser = () => hasRole("user");

  // Function to check if user has required role
  const requireRole = (role) => {
    if (!user) {
      navigate("/login");
      return false;
    }
    if (!hasRole(role)) {
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
