import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Calendar, Users, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sampleTours, initializeTourWithImage } from '@/lib/mockData';

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

// Feature component
const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
      <Icon className="h-8 w-8 text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Tour card component
const TourCard = ({ tour }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <Link to={`/tours/${tour.id}`} className="block">
      <div className="h-52 overflow-hidden relative">
        <img 
          src={tour.imageUrl} 
          alt={tour.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {tour.featured && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
            Nổi bật
          </div>
        )}
      </div>
    </Link>
    
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">
            <Link to={`/tours/${tour.id}`} className="hover:text-primary transition-colors">
              {tour.name}
            </Link>
          </h3>
          <div className="flex items-center mt-1 text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{tour.location}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="font-semibold">4.8</span>
        </div>
      </div>
      
      <p className="mt-3 text-gray-600 text-sm line-clamp-2">
        {tour.description}
      </p>
      
      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="font-bold text-lg text-primary">{formatCurrency(tour.price)}</span>
          <span className="text-gray-500 text-sm">/người</span>
        </div>
        <div className="text-gray-500 text-sm">
          {tour.duration}
        </div>
      </div>
    </div>
  </div>
);

// Destination card component
const DestinationCard = ({ name, imageUrl, tourCount }) => (
  <div className="relative group overflow-hidden rounded-lg">
    <img 
      src={imageUrl} 
      alt={name}
      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm">{tourCount} tour</p>
      </div>
    </div>
  </div>
);

// Testimonial component
const Testimonial = ({ name, role, quote, avatar }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center mb-4">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <h4 className="font-bold">{name}</h4>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
    <p className="text-gray-700 italic">{quote}</p>
    <div className="mt-4 flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      ))}
    </div>
  </div>
);

const Home = () => {
  const [featuredTours, setFeaturedTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState('');

  useEffect(() => {
    // Simulating API call to get featured tours
    const loadFeaturedTours = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Get up to 6 featured tours
      const tours = sampleTours
        .filter(tour => tour.featured)
        .slice(0, 6)
        .map(tour => initializeTourWithImage(tour));
      
      setFeaturedTours(tours);
      setIsLoading(false);
    };
    
    loadFeaturedTours();
  }, []);

  // Sample destination data
  const destinations = [
    { name: 'Hạ Long', imageUrl: 'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600', tourCount: 24 },
    { name: 'Đà Nẵng', imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600', tourCount: 18 },
    { name: 'Phú Quốc', imageUrl: 'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600', tourCount: 12 },
    { name: 'Đà Lạt', imageUrl: 'https://images.unsplash.com/photo-1559347309-c412cdcb7d4c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600', tourCount: 15 }
  ];

  // Sample testimonials
  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'Khách hàng thân thiết',
      quote: 'Dịch vụ tuyệt vời! Đã trải nghiệm nhiều tour du lịch qua TravelNow và chưa bao giờ thất vọng. Hướng dẫn viên chuyên nghiệp và thân thiện.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Trần Thị B',
      role: 'Nhà văn du lịch',
      quote: 'Chuyến đi Hạ Long thật khó quên. Đặc biệt ấn tượng với dịch vụ trên tàu và món ăn đậm đà hương vị Việt Nam. Chắc chắn sẽ quay lại!',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Lê Văn C',
      role: 'Blogger',
      quote: 'Giá cả phải chăng cho một trải nghiệm tuyệt vời. Các tour được thiết kế rất chu đáo, đi đúng lịch trình mà không vội vàng.',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg'
    }
  ];

  // Handle search form
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search for:', { destination, date, travelers });
    // Redirect to tours page with search params
  };

  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white relative">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Khám phá Việt Nam cùng chúng tôi
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Đặt tour du lịch dễ dàng với giá tốt nhất và dịch vụ chất lượng cao
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/tours">
                  Xem tất cả tour
                </Link>
              </Button>
              <Button variant="outline" className="bg-white/20" size="lg">
                Liên hệ ngay
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search section */}
      <div className="container mx-auto px-4 relative -mt-8 md:-mt-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Điểm đến
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="destination"
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  className="pl-10"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày đi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="date"
                  type="date"
                  className="pl-10"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">
                Số người
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="travelers"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                >
                  <option value="">Số người</option>
                  <option value="1">1 người</option>
                  <option value="2">2 người</option>
                  <option value="3">3 người</option>
                  <option value="4">4 người</option>
                  <option value="5">5 người</option>
                  <option value="6+">6+ người</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Features section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến những trải nghiệm du lịch tuyệt vời nhất với dịch vụ chất lượng cao và giá cả hợp lý
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Feature 
              icon={Calendar}
              title="Tour đa dạng"
              description="Hàng trăm tour du lịch đa dạng phù hợp với mọi nhu cầu và ngân sách của bạn"
            />
            <Feature 
              icon={Star}
              title="Dịch vụ chất lượng"
              description="Cam kết chất lượng dịch vụ tốt nhất từ khâu tư vấn đến kết thúc hành trình"
            />
            <Feature 
              icon={MapPin}
              title="Điểm đến hấp dẫn"
              description="Khám phá những điểm đến nổi tiếng và cả những địa điểm ít người biết đến"
            />
            <Feature 
              icon={Users}
              title="Hướng dẫn viên chuyên nghiệp"
              description="Đội ngũ hướng dẫn viên giàu kinh nghiệm, thân thiện và am hiểu văn hóa địa phương"
            />
          </div>
        </div>
      </section>

      {/* Featured tours section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Tour nổi bật</h2>
              <p className="text-gray-600 mt-2">Khám phá những tour du lịch được yêu thích nhất</p>
            </div>
            <Link to="/tours" className="text-primary hover:underline flex items-center">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

      {/* Popular destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Điểm đến phổ biến</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Khám phá những điểm đến du lịch hàng đầu tại Việt Nam
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Link to={`/tours?destination=${destination.name}`} key={destination.name}>
                <DestinationCard 
                  name={destination.name}
                  imageUrl={destination.imageUrl}
                  tourCount={destination.tourCount}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Những đánh giá từ khách hàng đã trải nghiệm dịch vụ của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Testimonial 
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bạn đã sẵn sàng cho chuyến đi tiếp theo?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Đăng ký ngay hôm nay để nhận thông tin về những ưu đãi độc quyền và tour du lịch mới nhất
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <Input 
              type="email" 
              placeholder="Nhập email của bạn" 
              className="bg-white/20 border-white/40 text-white placeholder:text-white/70"
            />
            <Button className="bg-white text-primary hover:bg-white/90">
              Đăng ký
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;