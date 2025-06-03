import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import mockAuth from "@/lib/firebase";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  // Email format validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { fullName, userName, password } = formData;

    // Validate email format
    if (!emailRegex.test(userName)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post("http://localhost:8080/travel/auth/register", { fullName, userName, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Dữ liệu đăng ký:", formData);

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await mockAuth.signInWithGoogle();

      if (result && result.user) {
        console.log("Đăng ký Google thành công:", result.user);
        navigate("/");
      } else {
        throw new Error("Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng ký Google:", error);
      setError("Đã xảy ra lỗi khi đăng ký với Google. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Đăng ký tài khoản</h1>
          <p className="text-gray-600">Tạo tài khoản để nhận các ưu đãi đặc biệt</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <Input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" />
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Tên người dùng
              </label>
              <Input
                id="userName"
                name="userName"
                type="email"
                required
                value={formData.userName}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Nhập mật khẩu (ít nhất 6 ký tự)" minLength={6} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu" minLength={6} />
            </div>

            <div className="flex items-start">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Tôi đồng ý với{" "}
                <a href="#" className="text-primary hover:underline">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="#" className="text-primary hover:underline">
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc đăng ký với</span>
            </div>
          </div>

          <div className="mt-6">
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleRegister} disabled={isLoading}>
              <FcGoogle className="h-5 w-5 mr-2" />
              Google
            </Button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-600 text-sm">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;