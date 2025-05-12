import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Users, Award, Globe, Layers } from "lucide-react";

const About = () => {
  const companyValues = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Khách hàng là trọng tâm",
      description: "Chúng tôi đặt trải nghiệm và sự hài lòng của khách hàng lên hàng đầu trong mọi dịch vụ mà chúng tôi cung cấp."
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Chất lượng vượt trội",
      description: "Cam kết mang đến các dịch vụ du lịch chất lượng cao từ đội ngũ hướng dẫn viên chuyên nghiệp đến các điểm tham quan hấp dẫn."
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Du lịch bền vững",
      description: "Chúng tôi luôn hướng đến việc phát triển du lịch bền vững, tôn trọng văn hóa địa phương và bảo vệ môi trường."
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Đổi mới sáng tạo",
      description: "Không ngừng cải tiến và phát triển các sản phẩm du lịch mới, độc đáo nhằm mang đến những trải nghiệm tuyệt vời nhất."
    }
  ];
  
  const teamMembers = [
    {
      name: "Nguyễn Văn An",
      position: "Giám đốc điều hành",
      bio: "Với hơn 15 năm kinh nghiệm trong ngành du lịch, anh An đã xây dựng TravelNow trở thành một trong những công ty du lịch hàng đầu Việt Nam."
    },
    {
      name: "Trần Thị Bình",
      position: "Giám đốc sản phẩm",
      bio: "Chuyên gia trong lĩnh vực phát triển sản phẩm du lịch với đam mê khám phá và kiến thức sâu rộng về các điểm đến trong nước."
    },
    {
      name: "Lê Hoàng Cường",
      position: "Trưởng phòng dịch vụ khách hàng",
      bio: "Với phương châm 'khách hàng là trên hết', anh Cường và đội ngũ của mình luôn sẵn sàng hỗ trợ khách hàng 24/7."
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Về Chúng Tôi</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          TravelNow là công ty du lịch hàng đầu Việt Nam, chuyên cung cấp các tour du lịch chất lượng cao với giá cả hợp lý. 
          Chúng tôi cam kết mang đến những trải nghiệm du lịch tuyệt vời và đáng nhớ cho khách hàng.
        </p>
      </section>

      {/* Story Section */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
            <p className="text-gray-700 mb-4">
              TravelNow được thành lập vào năm 2015 bởi một nhóm những người đam mê du lịch với mong muốn giúp mọi người khám phá vẻ đẹp tuyệt vời của Việt Nam.
            </p>
            <p className="text-gray-700 mb-4">
              Từ những ngày đầu chỉ với một văn phòng nhỏ và vài nhân viên, chúng tôi đã từng bước phát triển và mở rộng dịch vụ, trở thành một trong những công ty du lịch uy tín nhất tại Việt Nam.
            </p>
            <p className="text-gray-700 mb-4">
              Đến nay, TravelNow đã phục vụ hơn 50,000 khách hàng với hơn 500 tour du lịch đa dạng trên khắp các tỉnh thành Việt Nam, từ những thành phố sôi động đến những vùng đất thanh bình.
            </p>
            <p className="text-gray-700">
              Chúng tôi tự hào về đội ngũ nhân viên giàu kinh nghiệm, nhiệt tình và luôn đặt lợi ích của khách hàng lên hàng đầu.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=800" 
              alt="Đội ngũ TravelNow" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {companyValues.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Đội ngũ của chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4 h-16 w-16 bg-primary rounded-full mx-auto flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-semibold mb-1 text-center">{member.name}</h3>
                <p className="text-primary mb-4 text-center">{member.position}</p>
                <p className="text-gray-600 text-center">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievement Section */}
      <section className="mb-20 bg-neutral-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Thành tựu của chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
            <p className="text-gray-600">Khách hàng hài lòng</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-gray-600">Tour du lịch đa dạng</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100+</div>
            <p className="text-gray-600">Điểm đến khắp Việt Nam</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
            <p className="text-gray-600">Đánh giá từ khách hàng</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-primary mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-gray-700">Giải thưởng "Công ty du lịch xuất sắc" năm 2022 do Hiệp hội Du lịch Việt Nam trao tặng</p>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-primary mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-gray-700">Top 10 công ty du lịch uy tín nhất Việt Nam năm 2021, 2022</p>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-primary mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-gray-700">Chứng nhận "Dịch vụ chất lượng cao" từ Bộ Văn hóa, Thể thao và Du lịch</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Sẵn sàng cho chuyến đi tiếp theo?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Hãy để TravelNow đồng hành cùng bạn trong những hành trình khám phá Việt Nam tuyệt vời.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="text-lg px-8 py-6 h-auto">
            <Link href="/tours">
              Khám phá tour ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="text-lg px-8 py-6 h-auto">
            <Link href="/contact">Liên hệ với chúng tôi</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
