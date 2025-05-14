import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Giả lập gọi API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Trong thực tế sẽ gọi API để gửi email reset mật khẩu
      console.log("Gửi yêu cầu reset mật khẩu cho email:", email);

      setSuccess(true);
    } catch (error) {
      console.error("Lỗi gửi yêu cầu:", error);
      setError("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Kiểm tra email của bạn</h2>
          <p className="text-gray-600 mb-6">Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email {email}. Vui lòng kiểm tra hộp thư của bạn.</p>
          <div className="space-y-4">
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Quay lại đăng nhập
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
              <button onClick={() => setSuccess(false)} className="text-primary hover:underline">
                thử lại
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Quên mật khẩu?</h1>
          <p className="text-gray-600">Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email của bạn" />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </div>
        </form>

        <p className="text-center mt-8 text-gray-600 text-sm">
          Đã nhớ mật khẩu?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
