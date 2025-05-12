import { MapPin, Phone, Mail, Globe, Clock, Users, Shield, Award } from 'lucide-react';

const About = () => {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Về chúng tôi</h1>
          <p className="text-xl max-w-3xl mx-auto">
            TravelNow là công ty du lịch hàng đầu Việt Nam, chuyên cung cấp các tour du lịch chất lượng cao với giá cả hợp lý
          </p>
        </div>
      </div>
      
      {/* Our story */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Câu chuyện của chúng tôi</h2>
            
            <div className="space-y-6 text-gray-700">
              <p>
                Được thành lập vào năm 2015, TravelNow bắt đầu như một công ty nhỏ với đam mê giúp mọi người khám phá 
                vẻ đẹp của Việt Nam. Trải qua nhiều năm, chúng tôi đã phát triển thành một trong những công ty du lịch 
                có tốc độ phát triển nhanh nhất tại Việt Nam.
              </p>
              
              <p>
                Sứ mệnh của chúng tôi là mang đến những trải nghiệm du lịch tuyệt vời nhất cho khách hàng, giúp họ 
                khám phá, trải nghiệm và kết nối với văn hóa, con người và cảnh quan tuyệt đẹp của Việt Nam và khu vực 
                Đông Nam Á.
              </p>
              
              <p>
                Với đội ngũ nhân viên giàu kinh nghiệm và đam mê, chúng tôi cam kết mang đến dịch vụ chất lượng cao và 
                những trải nghiệm du lịch độc đáo cho khách hàng. Chúng tôi tin rằng mỗi chuyến đi đều là một câu chuyện 
                đáng nhớ, và chúng tôi luôn nỗ lực để viết nên những câu chuyện tuyệt vời cho khách hàng của mình.
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Tầm nhìn</h3>
                <p className="text-gray-700">
                  Trở thành công ty du lịch hàng đầu tại Việt Nam, mang đến những trải nghiệm du lịch chất lượng cao và 
                  độc đáo cho khách hàng trong nước và quốc tế.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Sứ mệnh</h3>
                <p className="text-gray-700">
                  Giúp mọi người khám phá vẻ đẹp của Việt Nam và khu vực Đông Nam Á thông qua các tour du lịch chất lượng 
                  cao, giá cả hợp lý và dịch vụ chuyên nghiệp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Values */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Giá trị cốt lõi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Khách hàng là trên hết</h3>
              <p className="text-gray-600">
                Chúng tôi luôn đặt nhu cầu và trải nghiệm của khách hàng lên hàng đầu trong mọi quyết định.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Chất lượng</h3>
              <p className="text-gray-600">
                Cam kết cung cấp dịch vụ chất lượng cao nhất từ khâu tư vấn đến kết thúc chuyến đi.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">An toàn</h3>
              <p className="text-gray-600">
                Đảm bảo an toàn là ưu tiên hàng đầu trong mọi chuyến đi chúng tôi tổ chức.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bền vững</h3>
              <p className="text-gray-600">
                Cam kết phát triển du lịch bền vững, tôn trọng môi trường và cộng đồng địa phương.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Đội ngũ của chúng tôi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="mb-4 relative">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="CEO"
                  className="w-32 h-32 rounded-full mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold">Nguyễn Văn A</h3>
              <p className="text-primary font-medium">Giám đốc điều hành</p>
              <p className="mt-2 text-gray-600 text-sm">
                Với hơn 15 năm kinh nghiệm trong ngành du lịch, anh A đã dẫn dắt công ty phát triển mạnh mẽ từ năm 2015.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="COO"
                  className="w-32 h-32 rounded-full mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold">Trần Thị B</h3>
              <p className="text-primary font-medium">Giám đốc vận hành</p>
              <p className="mt-2 text-gray-600 text-sm">
                Với kiến thức sâu rộng về quản lý và vận hành, chị B đảm bảo mọi tour du lịch đều diễn ra suôn sẻ và hiệu quả.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/62.jpg"
                  alt="CMO"
                  className="w-32 h-32 rounded-full mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold">Lê Văn C</h3>
              <p className="text-primary font-medium">Giám đốc marketing</p>
              <p className="mt-2 text-gray-600 text-sm">
                Anh C là người đứng sau những chiến dịch marketing thành công, giúp TravelNow trở thành thương hiệu du lịch được yêu thích.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact info */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Thông tin liên hệ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <MapPin className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Địa chỉ</h3>
              <p className="text-center text-gray-600">
                123 Nguyễn Huệ<br />
                Quận 1, TP. Hồ Chí Minh
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <Phone className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Điện thoại</h3>
              <p className="text-center text-gray-600">
                0123 456 789<br />
                0987 654 321
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <Mail className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-center text-gray-600">
                info@travelnow.com<br />
                support@travelnow.com
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Giờ làm việc</h3>
              <p className="text-center text-gray-600">
                Thứ 2 - Thứ 6: 8:00 - 17:30<br />
                Thứ 7: 8:00 - 12:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;