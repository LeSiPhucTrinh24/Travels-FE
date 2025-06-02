// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { Phone, MapPin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TravelNow</h3>
            <p className="text-gray-400 mb-4">Khám phá Việt Nam cùng TravelNow - Đối tác du lịch đáng tin cậy của bạn với hàng nghìn tour chất lượng cao.</p>
            {/* Social links here... (same as cũ) */}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Công ty</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Liên hệ
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Hướng dẫn đặt tour
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Phương thức thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Chính sách hủy tour
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">77 Nguyễn Huệ, Thành Phố Huế</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  0123 456 789
                  <br />
                  0987 654 321
                </span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">lesiphuctrinh@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 TravelNow. Tất cả các quyền được bảo lưu.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Điều khoản
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Bảo mật
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
