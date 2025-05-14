import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import mockAuth from "@/lib/firebase";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Tài khoản demo để test
const DEMO_ACCOUNTS = {
  // Tài khoản quản trị viên
  admin: {
    email: "admin@gmail.com",
    password: "admin123",
    userData: {
      id: "admin-1",
      name: "Admin",
      email: "admin@gmail.com",
      role: "admin", // Phân quyền admin
      photoURL: "https://ui-avatars.com/api/?name=Admin&background=random",
    },
  },
  // Tài khoản người dùng thông thường
  user: {
    email: "lesiphuctrinh@gmail.com",
    password: "123456",
    userData: {
      id: "user-1",
      name: "Lê Sĩ Phúc Trình",
      email: "lesiphuctrinh@gmail.com",
      role: "user", // Phân quyền user thường
      photoURL: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    },
  },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      // Giả lập delay gọi API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Kiểm tra tài khoản admin
      if (formData.email === DEMO_ACCOUNTS.admin.email && formData.password === DEMO_ACCOUNTS.admin.password) {
        login(DEMO_ACCOUNTS.admin.userData);
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng Admin quay trở lại!",
        });
        navigate("/admin");
        return;
      }

      // Kiểm tra tài khoản user thường
      if (formData.email === DEMO_ACCOUNTS.user.email && formData.password === DEMO_ACCOUNTS.user.password) {
        login(DEMO_ACCOUNTS.user.userData);
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!",
        });
        navigate("/");
        return;
      }

      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.",
      });
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
          role: "user",
          photoURL: result.user.photoURL,
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Nhập email của bạn" />
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
