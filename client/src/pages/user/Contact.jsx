import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div>
      {/* Hero section */}
      <div className="relative  text-white">
        <div className="absolute inset-0 overflow-hidden animate-bg-pan" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596524430615-b46475ddff6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-gradient-to-b "></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596524430615-b46475ddff6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "overlay", opacity: 0.3 }}></div>
        </div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl m-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Liên hệ với chúng tôi</h1>
            <p className="text-xl opacity-90 mb-8">Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc và lắng nghe ý kiến đóng góp của bạn.</p>
          </div>
        </div>
      </div>

      {/* Contact section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Thông tin liên hệ</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Địa chỉ văn phòng</h3>
                    <p className="text-gray-600">77 Nguyễn Huệ, Thành Phố Huế</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4 flex-shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Số điện thoại</h3>
                    <p className="text-gray-600">
                      <a href="tel:+84123456789" className="hover:text-primary transition-colors">
                        (+84) 123 456 789
                      </a>
                      <br />
                      <a href="tel:+84987654321" className="hover:text-primary transition-colors">
                        (+84) 987 654 321
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@travelnow.com" className="hover:text-primary transition-colors">
                        info@travelnow.com
                      </a>
                      <br />
                      <a href="mailto:support@travelnow.com" className="hover:text-primary transition-colors">
                        support@travelnow.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Giờ làm việc</h3>
                    <p className="text-gray-600">
                      Thứ Hai - Thứ Sáu: 8:00 - 18:00
                      <br />
                      Thứ Bảy: 8:00 - 12:00
                      <br />
                      Chủ Nhật: Nghỉ
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-3">Bản đồ</h3>
                <div className="rounded-lg overflow-hidden h-80 bg-gray-200">
                  <iframe
                    title="TravelNow Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.394862690812!2d106.70233371540584!3d10.780861292317075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xe5ec4e794e8f1b76!2sNguyen%20Hue%20Walking%20Street!5e0!3m2!1sen!2s!4v1652257042004!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Gửi tin nhắn cho chúng tôi</h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Cảm ơn bạn đã liên hệ!</h3>
                  <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất. Thông thường, chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      });
                    }}
                  >
                    Gửi tin nhắn khác
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Họ tên <span className="text-red-500">*</span>
                      </label>
                      <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Nhập họ tên của bạn" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Nhập email của bạn" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Nhập số điện thoại của bạn" />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Chủ đề
                      </label>
                      <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} placeholder="Nhập chủ đề" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Nội dung tin nhắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nhập nội dung tin nhắn của bạn"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    ></textarea>
                  </div>

                  <div className="flex items-center">
                    <input id="privacy" name="privacy" type="checkbox" required className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
                      Tôi đồng ý với{" "}
                      <a href="#" className="text-primary hover:underline">
                        Chính sách bảo mật
                      </a>{" "}
                      của TravelNow.
                    </label>
                  </div>

                  <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Gửi tin nhắn
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
            <p className="text-gray-600">Dưới đây là một số câu hỏi thường gặp từ khách hàng. Nếu bạn không tìm thấy câu trả lời cho thắc mắc của mình, vui lòng liên hệ trực tiếp với chúng tôi.</p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-2">Làm thế nào để đặt tour du lịch?</h3>
              <p className="text-gray-600">Bạn có thể đặt tour trực tuyến trên website của chúng tôi bằng cách chọn tour mong muốn, điền thông tin và thanh toán. Ngoài ra, bạn cũng có thể liên hệ trực tiếp với chúng tôi qua điện thoại hoặc email để được hỗ trợ đặt tour.</p>
            </div>
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-2">Chính sách hủy tour như thế nào?</h3>
              <p className="text-gray-600">
                Đối với việc hủy tour, chúng tôi áp dụng chính sách hoàn tiền như sau: Hủy trước 7 ngày: hoàn 100% phí tour, hủy trước 3-7 ngày: hoàn 50% phí tour, hủy trong vòng 3 ngày: không hoàn phí tour. Một số tour đặc biệt có thể có chính sách riêng và sẽ được thông báo khi đặt tour.
              </p>
            </div>
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-2">Tôi có thể thanh toán bằng những phương thức nào?</h3>
              <p className="text-gray-600">Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau bao gồm: thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay, VNPay), và thanh toán tiền mặt tại văn phòng. Tất cả các giao dịch trực tuyến đều được bảo mật.</p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Tour có bao gồm bảo hiểm du lịch không?</h3>
              <p className="text-gray-600">Tất cả các tour của chúng tôi đều bao gồm bảo hiểm du lịch cơ bản. Tuy nhiên, chúng tôi khuyến khích khách hàng nên mua thêm bảo hiểm du lịch toàn diện để được bảo vệ tốt hơn trong những trường hợp không mong muốn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
