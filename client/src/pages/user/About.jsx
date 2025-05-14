import { Users, Award, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div>
      {/* Hero section */}
      <div className="relative text-white">
        <div className="absolute inset-0 overflow-hidden animate-bg-pan" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-black opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b "></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "overlay", opacity: 0.3 }}></div>
        </div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-5xl m-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Về TravelNow</h1>
            <p className="text-xl opacity-90 mb-8">Chúng tôi mang đến những trải nghiệm du lịch tuyệt vời, kết nối bạn với những điểm đến đáng nhớ trên khắp Việt Nam.</p>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-gray-600 mb-6">
                Được thành lập vào năm 2018, TravelNow ra đời với mục tiêu giúp cho việc du lịch trở nên dễ dàng, thuận tiện và đáng nhớ. Với đội ngũ nhân viên giàu kinh nghiệm và đam mê, chúng tôi cam kết mang đến những trải nghiệm du lịch tuyệt vời nhất cho khách hàng.
              </p>
              <p className="text-gray-600 mb-6">
                Chúng tôi tin rằng du lịch không chỉ là việc đi từ điểm A đến điểm B, mà còn là cơ hội để khám phá, học hỏi và kết nối. Từ những bãi biển tuyệt đẹp đến những ngọn núi hùng vĩ, từ những thành phố nhộn nhịp đến những làng quê yên bình, TravelNow cam kết giúp bạn khám phá vẻ đẹp đa dạng
                của Việt Nam.
              </p>
              <div className="flex flex-wrap gap-6 mt-8">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">10,000+</h3>
                    <p className="text-gray-500 text-sm">Khách hàng hài lòng</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">100+</h3>
                    <p className="text-gray-500 text-sm">Điểm đến hấp dẫn</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">4.8/5</h3>
                    <p className="text-gray-500 text-sm">Đánh giá trung bình</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="About TravelNow" className="rounded-lg shadow-xl w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
            <p className="text-gray-600">Tại TravelNow, chúng tôi hoạt động dựa trên những giá trị cốt lõi này để đảm bảo mang lại trải nghiệm tuyệt vời cho mỗi khách hàng.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Chất lượng cao</h3>
              <p className="text-gray-600">Chúng tôi cam kết cung cấp dịch vụ và trải nghiệm chất lượng cao nhất cho khách hàng. Từ việc lựa chọn khách sạn, nhà hàng đến phương tiện di chuyển, chúng tôi luôn ưu tiên chất lượng hàng đầu.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Khách hàng là trung tâm</h3>
              <p className="text-gray-600">Mọi quyết định của chúng tôi đều được đưa ra với sự quan tâm đến nhu cầu và mong muốn của khách hàng. Chúng tôi lắng nghe và điều chỉnh để đảm bảo sự hài lòng tuyệt đối của khách hàng.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Đam mê du lịch</h3>
              <p className="text-gray-600">Chúng tôi thực sự đam mê về du lịch và khám phá. Chính niềm đam mê này thúc đẩy chúng tôi liên tục tìm kiếm những điểm đến mới, trải nghiệm độc đáo để giới thiệu với khách hàng.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Hãy cùng khám phá những điểm đến tuyệt vời</h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">Chúng tôi sẵn sàng giúp bạn lên kế hoạch cho chuyến đi tiếp theo của mình. Khám phá các tour du lịch hấp dẫn với TravelNow!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tours">
              <Button variant="secondary" size="lg">
                Xem các tour
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Liên hệ với chúng tôi
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
