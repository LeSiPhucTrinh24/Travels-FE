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
  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });

  const hasRole = (userRoles, role) => {
    if (!userRoles || !Array.isArray(userRoles)) return false;
    return userRoles.some((r) => r.toLowerCase() === role.toLowerCase());
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      userName: "",
      password: "",
    };

    // Validate username
    if (!formData.userName.trim()) {
      newErrors.userName = "Vui lòng nhập tên đăng nhập";
      isValid = false;
    }

    // Validate password (giống username)
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Thông tin chưa hợp lệ",
        description: "Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.",
      });
      return;
    }

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
        }
      );

      const data = response.data.result || response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
      }

      const userData = {
        id: data.userId || null,
        name: data.fullName || "",
        userName: data.userName || "",
        phone: data.phone || "",
        address: data.address || "",
        dob: data.dob || "",
        avatar: data.avatar || "",
        roles: Array.isArray(data.roles) ? data.roles : [],
      };

      login(userData);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${userData.name || userData.userName}!`,
      });

      const location = window.location;
      const params = new URLSearchParams(location.search);
      const returnUrl = params.get("returnUrl") || location.state?.from;

      if (hasRole(userData.roles, "ADMIN")) {
        navigate("/admin");
      } else if (returnUrl) {
        navigate(returnUrl);
      } else {
        navigate("/");
      }
    } catch (error) {
      let errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác";
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "";

        if (status === 401) {
          const lowerMsg = message.toLowerCase();
          if (lowerMsg.includes("mật khẩu") || lowerMsg.includes("password")) {
            errorMessage = "Mật khẩu không chính xác";
          } else if (lowerMsg.includes("không tồn tại") || lowerMsg.includes("username")) {
            errorMessage = "Tên đăng nhập không tồn tại";
          } else {
            errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác";
          }
        }

        toast({
          variant: "destructive",
          title: "Đăng nhập thất bại",
          description: errorMessage,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng của bạn.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await mockAuth.signInWithGoogle();
      if (result && result.user) {
        const userData = {
          id: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          roles: ["USER"],
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
              <Input id="userName" name="userName" type="text" required value={formData.userName} onChange={handleChange} placeholder="Nhập tên đăng nhập" className={errors.userName ? "border-red-500" : ""} />
              {errors.userName && <p className="mt-1 text-sm text-red-500">{errors.userName}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Nhập mật khẩu của bạn" className={errors.password ? "border-red-500" : ""} />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
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
