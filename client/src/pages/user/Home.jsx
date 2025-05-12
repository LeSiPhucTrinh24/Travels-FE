import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TourCard from '@/components/common/TourCard';
import SearchForm from '@/components/common/SearchForm';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  Users,
  ArrowRight,
  LucideArrowRight,
  Star,
  ChevronRight
} from 'lucide-react';

import { sampleTours, initializeTourWithImage } from '@/lib/mockData';

const Home = () => {
  const [featuredTours, setFeaturedTours] = useState([]);
  
  // Simulating API call with React Query
  const { 
    data: tours = [], 
    isLoading
  } = useQuery({
    queryKey: ['/api/tours/featured'],
    queryFn: () => Promise.resolve(
      sampleTours.map(tour => initializeTourWithImage({
        ...tour, 
        id: Math.floor(Math.random() * 10000), // Random ID for demo purposes
        rating: (4 + Math.random()).toFixed(1) // Random rating between 4.0-5.0
      }))
    ),
    staleTime: Infinity,
  });
  
  useEffect(() => {
    if (tours.length > 0) {
      setFeaturedTours(tours.filter(tour => tour.featured).slice(0, 6));
    }
  }, [tours]);
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      location: 'Hà Nội',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      text: 'Chuyến du lịch tuyệt vời! Hướng dẫn viên rất thân thiện và chuyên nghiệp. Tôi sẽ tiếp tục sử dụng dịch vụ của TravelNow trong tương lai.',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      location: 'TP.HCM',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4,
      text: 'Dịch vụ rất tốt, lịch trình hợp lý. Tuy nhiên, khách sạn có thể tốt hơn một chút. Nhìn chung tôi vẫn rất hài lòng với chuyến đi.',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      location: 'Đà Nẵng',
      image: 'https://randomuser.me/api/portraits/men/62.jpg',
      rating: 5,
      text: 'Đây là lần thứ ba tôi đặt tour qua TravelNow và chưa bao giờ thất vọng. Chất lượng dịch vụ luôn ổn định và đáng tin cậy.',
    },
  ];
  
  // Features data
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'An toàn & Đáng tin cậy',
      description: 'Sự an toàn của khách hàng luôn là ưu tiên hàng đầu của chúng tôi với đội ngũ hướng dẫn viên chuyên nghiệp.'
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: 'Trải nghiệm chất lượng cao',
      description: 'Chúng tôi cam kết mang đến những trải nghiệm du lịch tốt nhất với dịch vụ chất lượng cao.'
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'Lịch trình linh hoạt',
      description: 'Các tour của chúng tôi có lịch trình linh hoạt, phù hợp với nhu cầu và thời gian của khách hàng.'
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7, bất kể bạn đang ở đâu.'
    }
  ];
  
  // Destinations data
  const destinations = [
    {
      name: 'Vịnh Hạ Long',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300',
      tours: 12
    },
    {
      name: 'Hội An',
      image: 'https://images.unsplash.com/photo-1540998871672-38471ce50502?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300',
      tours: 10
    },
    {
      name: 'Sapa',
      image: 'https://images.unsplash.com/photo-1577440708692-ab186b6bb00a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300',
      tours: 8
    },
    {
      name: 'Đà Lạt',
      image: 'https://images.unsplash.com/photo-1559897492-51850c164217?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300',
      tours: 15
    }
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white pb-16 pt-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Khám phá Việt Nam cùng TravelNow
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Đặt tour du lịch dễ dàng với giá tốt nhất và dịch vụ chất lượng cao
            </p>
          </div>
          
          {/* Search Form */}
          <div className="relative z-10 -mb-24">
            <SearchForm variant="hero" />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="mt-32 mb-20 py-10">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại sao chọn TravelNow?</h2>
            <p className="text-gray-600">
              Chúng tôi cung cấp trải nghiệm du lịch hoàn hảo với dịch vụ chất lượng cao và giá cả hợp lý
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Tours Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Tour nổi bật</h2>
              <p className="text-gray-600">Khám phá những tour du lịch được yêu thích nhất</p>
            </div>
            <Link to="/tours">
              <Button variant="outline" className="mt-4 md:mt-0">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-[350px] animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="flex justify-between mt-4">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Điểm đến phổ biến</h2>
            <p className="text-gray-600">
              Khám phá những điểm đến nổi tiếng và hấp dẫn nhất tại Việt Nam
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <div 
                key={index} 
                className="group relative rounded-lg overflow-hidden h-60"
              >
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-white text-xl font-bold mb-1">
                    {destination.name}
                  </h3>
                  <div className="flex items-center text-white text-sm">
                    <span>{destination.tours} tours</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Đánh giá từ khách hàng</h2>
            <p className="text-gray-600">
              Xem những gì khách hàng nói về trải nghiệm du lịch cùng chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="mb-6 text-gray-600 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Sẵn sàng cho chuyến phiêu lưu tiếp theo?
            </h2>
            <p className="text-lg mb-8">
              Đặt tour ngay hôm nay và nhận ưu đãi đặc biệt!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/tours">
                <Button className="text-primary bg-white hover:bg-gray-100 hover:text-primary">
                  Khám phá các tour
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Liên hệ với chúng tôi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;