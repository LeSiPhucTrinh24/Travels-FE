import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const { backendUrl } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  // Hàm kiểm tra role (không phân biệt chữ hoa thường)
  const hasRole = (userRoles, role) => {
    if (!userRoles || !Array.isArray(userRoles)) return false;
    return userRoles.some((r) => r.toLowerCase() === role.toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/auth/login`,
        {
          userName: formData.userName,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Nếu backend dùng cookie thì giữ withCredentials
          // withCredentials: true,
        }
      );

      const data = response.data.result || response.data; // phụ thuộc backend trả về

      // Log dữ liệu trả về từ backend
      console.log("Login response:", data);
      console.log("Roles from backend:", data.roles);

      // Lưu token vào localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Chuẩn bị thông tin user để lưu vào context
      const userData = {
        id: data.userId || null,
        name: data.fullName || "",
        userName: data.userName || "",
        phone: data.phone || "",
        address: data.address || "",
        roles: Array.isArray(data.roles) ? data.roles : [],
      };

      // Log dữ liệu userData và roles sau khi chuẩn hóa
      console.log("userData:", userData);
      console.log("userData.roles:", userData.roles);
      console.log("isAdmin:", hasRole(userData.roles, "ADMIN"));
      console.log("isUser:", hasRole(userData.roles, "USER"));

      // Gọi hàm login lưu user vào context
      login(userData);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${userData.name || userData.userName}!`,
      });

      // Điều hướng theo vai trò
      if (hasRole(userData.roles, "ADMIN")) {
        navigate("/admin");
      } else if (hasRole(userData.roles, "USER")) {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Tài khoản hoặc mật khẩu không đúng.";

        if (status === 401) {
          toast({
            variant: "destructive",
            title: "Không được phép",
            description: "Tài khoản hoặc mật khẩu không chính xác.",
          });
        } else {
          toast({
            variant: "destructive",
            title: `Lỗi ${status}`,
            description: message,
          });
        }
        console.error("Chi tiết lỗi:", error.response.data);
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi không xác định",
          description: error.message || "Không thể kết nối đến máy chủ.",
        });
        console.error("Lỗi không xác định:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Giả lập Google Auth nếu chưa tích hợp thật
      const result = await mockAuth.signInWithGoogle();
      if (result && result.user) {
        const userData = {
          id: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          roles: ["USER"], // giả lập role USER
        };
        login(userData);
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!",
        });
        navigate("/");
      } else {
        throw new Error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: "Đã xảy ra lỗi khi đăng nhập với Google. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Đăng nhập</h1>
          <p className="text-gray-600">Chào mừng bạn quay trở lại với TravelNow</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <Input id="userName" name="userName" type="text" required value={formData.userName} onChange={handleChange} placeholder="Nhập tên đăng nhập hoặc email" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Nhập mật khẩu của bạn" />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc đăng nhập với</span>
            </div>
          </div>

          <div className="mt-6">
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
              <FcGoogle className="h-5 w-5 mr-2" />
              Google
            </Button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-600 text-sm">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
