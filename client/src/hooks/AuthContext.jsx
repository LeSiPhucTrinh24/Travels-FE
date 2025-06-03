import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";

const AuthContext = createContext();

// Component xử lý điều hướng và thông báo
const AuthProviderContent = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Khởi tạo trạng thái người dùng từ localStorage nếu có
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Xác thực token và làm mới nếu cần
  const validateToken = async () => {
    const token = localStorage.getItem("token");

    // Định nghĩa các đường dẫn công khai
    const publicPaths = [
      "/", // Trang chủ
      "/tours", // Danh sách tour
      "/tours/:tourId", // Trang chi tiết tour (placeholder)
      "/about", // Về chúng tôi
      "/contact", // Liên hệ
      "/login", // Trang đăng nhập
      "/register", // Trang đăng ký
      "/forgot-password", // Trang quên mật khẩu
    ];

    // Kiểm tra xem đường dẫn hiện tại có phải là đường dẫn công khai không
    const isPublicPath = publicPaths.some(
      (path) => location.pathname === path || (path === "/tours/:tourId" && location.pathname.startsWith("/tours/")) // Xử lý đường dẫn chi tiết tour
    );

    // Nếu không có token
    if (!token) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("userId");

      // Nếu đang ở đường dẫn công khai, chỉ cần dừng lại và set loading = false
      if (isPublicPath) {
        console.debug("Không có token, đang ở đường dẫn công khai. Không chuyển hướng.");
        setIsLoading(false);
        return;
      }

      // Nếu không có token và không ở đường dẫn công khai, chuyển hướng đến login
      console.debug("Không có token, không phải đường dẫn công khai, chuyển hướng đến login");
      setIsLoading(false); // Set loading = false trước khi chuyển hướng
      if (location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/forgot-password") {
        navigate("/login", { state: { from: location.pathname } });
      }

      return; // Kết thúc hàm
    }

    // Nếu có token, tiến hành xác thực bằng cách gọi API lấy thông tin người dùng
    try {
      console.debug("Đang xác thực token với /users/myInfo");
      const response = await axiosInstance.get("/users/myInfo");
      const userData = response.data.result || response.data;

      // Xác thực dữ liệu phản hồi
      if (!userData || !userData.userId) {
        throw new Error("Dữ liệu người dùng từ API không hợp lệ");
      }

      // Cập nhật trạng thái người dùng với dữ liệu mới
      const updatedUser = {
        id: userData.userId,
        name: userData.fullName || userData.userName || "",
        userName: userData.userName || "",
        phone: userData.phone || "",
        address: userData.address || "",
        dob: userData.dob || "",
        avatar: userData.avatar || "",
        roles: Array.isArray(userData.roles) ? userData.roles : [],
      };

      console.debug("Dữ liệu người dùng từ API:", updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Kiểm tra quyền admin chỉ khi ở tuyến đường admin
      if (location.pathname.startsWith("/admin")) {
        if (!hasRole(updatedUser.roles, "admin")) {
          console.debug("Người dùng không phải admin, chuyển hướng về trang chủ");
          toast({
            variant: "destructive",
            title: "Không có quyền truy cập",
            description: "Bạn không có quyền truy cập trang quản trị",
          });
          navigate("/");
        }
      }
      // Nếu xác thực thành công và đang ở trang login/register, chuyển hướng về trang chủ hoặc trang trước đó
      if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password") {
        const from = location.state?.from || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Xác thực token thất bại:", error.message, error.response?.data);
      // Xử lý lỗi 401/403 cụ thể hoặc các lỗi khác liên quan đến token
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.debug("Token không hợp lệ hoặc hết hạn, xóa dữ liệu xác thực");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        setUser(null);

        // Chỉ hiển thị toast và chuyển hướng nếu không ở trang công khai (trừ login/register)
        if (!isPublicPath && location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/forgot-password") {
          toast({
            variant: "destructive",
            title: "Phiên đăng nhập hết hạn",
            description: "Vui lòng đăng nhập lại.",
          });
          navigate("/login", { state: { from: location.pathname } });
        } else if ((location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password") && token) {
          // Nếu đang ở trang auth nhưng token lỗi, vẫn xóa token và không toast/redirect
          console.debug("Token lỗi khi đang ở trang xác thực, chỉ xóa token.");
        }
      } else {
        // Xử lý các lỗi API khác không liên quan trực tiếp đến token
        console.error("Chi tiết lỗi API:", error.response?.data || error.message);
        // Chỉ hiển thị toast lỗi nếu không ở trang công khai
        if (!isPublicPath) {
          toast({
            variant: "destructive",
            title: "Lỗi kết nối",
            description: "Không thể lấy thông tin người dùng. Vui lòng thử lại sau.",
          });
        }
      }
    } finally {
      // Dù xác thực thành công hay thất bại, luôn set loading = false khi hoàn thành
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, [location.pathname]); // Kích hoạt lại khi đường dẫn thay đổi

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Thiếu token hoặc userId");
      }

      // Gọi API đăng xuất với cấu trúc LogoutRequest
      console.debug("Đang gọi API đăng xuất");
      await axiosInstance.post(
        "/auth/logout",
        {
          userId: parseInt(userId),
          token: token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Xóa local storage và trạng thái
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống",
      });

      navigate("/login");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error.response?.data || error.message);
      // Xóa dữ liệu ngay cả khi API đăng xuất thất bại
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

  // Hàm tiện ích để kiểm tra vai trò
  const hasRole = (roles, role) => {
    if (!roles || !Array.isArray(roles)) return false;
    const result = roles.some((r) => r.toLowerCase() === role.toLowerCase());
    console.debug(`Kiểm tra vai trò ${role}:`, result, roles);
    return result;
  };

  const isAdmin = () => hasRole(user?.roles, "admin");
  const isUser = () => hasRole(user?.roles, "user");

  const requireRole = (role) => {
    // Không chuyển hướng khi đang tải
    if (isLoading) {
      console.debug("Đang tải, không chuyển hướng");
      return false;
    }
    if (!user) {
      console.debug("Không có người dùng, chuyển hướng đến login");
      navigate("/login");
      return false;
    }
    if (!hasRole(user.roles, role)) {
      console.debug(`Người dùng thiếu vai trò ${role}, chuyển hướng về trang chủ`);
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

// Component wrapper không sử dụng hooks
export const AuthProvider = ({ children }) => {
  return <AuthProviderContent>{children}</AuthProviderContent>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};
