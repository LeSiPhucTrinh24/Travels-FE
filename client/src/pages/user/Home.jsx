import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, ChevronRight, ArrowRight, Star, Search, Globe, Coffee, Heart, Plane, Compass, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleTours, initializeTourWithImage } from "@/lib/mockData";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

// Tour card component
const TourCard = ({ tour, onClick }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
    <div className="h-48 overflow-hidden relative">
      <img src={tour.coverImage} alt={tour.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
      {tour.featured && <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Nổi bật</div>}
    </div>

    <div className="p-4">
      <h3 className="font-bold text-lg mb-1">{tour.name}</h3>
      <div className="flex items-center mb-2 text-gray-500 text-sm">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{tour.departureLocation}</span>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>

      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="font-bold text-lg text-primary">{formatCurrency(tour.price)}</span>
          <span className="text-gray-500 text-sm">/người</span>
        </div>
        <div className="text-gray-500 text-sm">{tour.duration} ngày</div>
      </div>
    </div>
  </div>
);

// Destination card component
const DestinationCard = ({ destination, onClick }) => (
  <div className="relative rounded-lg overflow-hidden group cursor-pointer h-60" onClick={onClick}>
    <img src={destination.imageUrl} alt={destination.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-4">
      <h3 className="text-white font-bold text-lg mb-1">{destination.name}</h3>
      <div className="flex items-center text-white/80 text-sm">
        <span className="mr-2">{destination.tourCount} tour</span>
        <span>từ {formatCurrency(destination.minPrice)}</span>
      </div>
    </div>
  </div>
);

// Testimonial component
const Testimonial = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center mb-4">
      <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
        <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="font-semibold">{testimonial.name}</h4>
        <div className="flex mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-600">"{testimonial.comment}"</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [featuredTours, setFeaturedTours] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [displayedFeaturedTours, setDisplayedFeaturedTours] = useState([]);
  const [searchParams, setSearchParams] = useState({
    destination: "",
    date: "",
    people: "",
  });

  // Fetch featured tours
  useEffect(() => {
    const fetchFeaturedTours = async () => {
      setIsLoadingFeatured(true);
      try {
        const response = await axiosInstance.get("/tours"); // Assuming '/tours' endpoint returns all tours
        // Map backend 'featured' to frontend 'featured' and filter
        const featured = response.data.result
          .map((tour) => ({
            ...tour,
            featured: tour.featured === true || tour.featured === "true",
          }))
          .filter((tour) => tour.featured === true);
        setFeaturedTours(featured);
        setDisplayedFeaturedTours(featured);
      } catch (error) {
        console.error("Error fetching featured tours:", error);
        toast.error("Không thể tải danh sách tour nổi bật.");
        setFeaturedTours([]);
        setDisplayedFeaturedTours([]);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  // Apply filters to featured tours when searchParams change
  useEffect(() => {
    let results = [...featuredTours];

    // Filter by destination
    if (searchParams.destination) {
      results = results.filter((tour) => tour.departureLocation.toLowerCase().includes(searchParams.destination.toLowerCase()) || tour.name.toLowerCase().includes(searchParams.destination.toLowerCase()));
    }

    // Filter by date
    if (searchParams.date) {
      const selectedDate = new Date(searchParams.date);
      results = results.filter((tour) => {
        const tourDate = new Date(tour.departureDate);
        // Compare dates only (ignore time part)
        return tourDate.toDateString() === selectedDate.toDateString();
      });
    }

    // Filter by people (assuming maxPeople or a similar field exists on tour object)
    if (searchParams.people) {
      const requiredPeople = parseInt(searchParams.people);
      if (!isNaN(requiredPeople)) {
        results = results.filter((tour) => {
          // Assuming tour object has a 'maxPeople' or 'capacity' field
          // Adjust this logic based on your actual tour data structure
          // For simplicity, let's assume a 'maxPeople' field indicates suitability
          if (searchParams.people === "5+") {
            return tour.maxPeople && tour.maxPeople >= 5;
          } else {
            return tour.maxPeople && tour.maxPeople >= requiredPeople;
          }
        });
      }
    }

    setDisplayedFeaturedTours(results);
  }, [searchParams, featuredTours]);

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/tours?${query}`);
  };

  // Handle tour card click
  const handleTourClick = (tourId) => {
    navigate(`/tours/${tourId}`);
  };

  // Handle destination card click
  const handleDestinationClick = (destination) => {
    navigate(`/tours?destination=${destination}`);
  };

  // Sample destinations
  const destinations = [
    {
      id: 1,
      name: "Hạ Long",
      imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tourCount: 15,
      minPrice: 1500000,
    },
    {
      id: 2,
      name: "Đà Nẵng",
      imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tourCount: 23,
      minPrice: 1200000,
    },
    {
      id: 3,
      name: "Đà Lạt",
      imageUrl: "https://images.unsplash.com/photo-1501256504904-1fbe305bb538?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tourCount: 18,
      minPrice: 900000,
    },
    {
      id: 4,
      name: "Phú Quốc",
      imageUrl: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tourCount: 12,
      minPrice: 2000000,
    },
  ];

  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      rating: 5,
      comment: "Chuyến đi tuyệt vời! Hướng dẫn viên rất thân thiện và chuyên nghiệp. Cảnh đẹp, ăn ngon, khách sạn sạch sẽ. Tôi sẽ tiếp tục đặt tour tại đây trong tương lai.",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
    {
      id: 2,
      name: "Trần Thị B",
      rating: 4,
      comment: "Dịch vụ rất tốt, lịch trình hợp lý. Tuy nhiên, khách sạn có thể tốt hơn một chút. Nhìn chung tôi vẫn rất hài lòng với chuyến đi.",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
    {
      id: 3,
      name: "Lê Văn C",
      rating: 5,
      comment: "Đây là lần thứ ba tôi đặt tour qua đây và chưa bao giờ thất vọng. Chất lượng dịch vụ luôn ổn định và đáng tin cậy.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
  ];

  return (
    <div>
      {/* Hero section */}
      <div className="relative text-white">
        <div className="absolute inset-0 overflow-hidden ">
          <div
            className="absolute inset-0 animate-bg-pan"
            style={{
              backgroundImage: 'url("https://thaiantravel.com/wp-content/uploads/2024/06/phuong-hoang-net-2-jpg.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Lớp phủ tối */}
          <div className="absolute inset-0 bg-black opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b "></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1551634979-2b11f8c218da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "overlay", opacity: 0.5 }}></div>
        </div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-5xl m-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Khám phá Việt Nam cùng TravelNow</h1>
            <p className="text-xl opacity-90 mb-8 text-white">Hàng nghìn tour du lịch chất lượng cao với giá ưu đãi, đặt ngay hôm nay để có những trải nghiệm tuyệt vời!</p>

            {/* Search form */}
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <form onSubmit={handleSearchSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="destination" className="block text-xs font-medium text-gray-500 mb-1">
                      Điểm đến
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input id="destination" value={searchParams.destination} onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })} placeholder="Bạn muốn đi đâu?" className="pl-10 text-gray-900" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-xs font-medium text-gray-500 mb-1">
                      Ngày khởi hành
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input id="date" type="date" value={searchParams.date} onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })} className="pl-10 text-gray-900" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="people" className="block text-xs font-medium text-gray-500 mb-1">
                      Số người
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="people"
                        value={searchParams.people}
                        onChange={(e) => setSearchParams({ ...searchParams, people: e.target.value })}
                        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                      >
                        <option value="">Số người</option>
                        <option value="1">1 người</option>
                        <option value="2">2 người</option>
                        <option value="3">3 người</option>
                        <option value="4">4 người</option>
                        <option value="5+">5+ người</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button type="submit" className="px-6">
                    <Search className="h-4 w-4 mr-2" />
                    Tìm kiếm
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Popular destinations */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Điểm đến phổ biến</h2>
              <p className="text-gray-600 mt-2">Khám phá những điểm đến được yêu thích nhất</p>
            </div>
            <Link to="/tours" className="hidden md:flex items-center text-primary hover:underline">
              <span className="mr-1">Xem tất cả</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} onClick={() => handleDestinationClick(destination.name)} />
            ))}
          </div>

          <div className="mt-8 flex justify-center md:hidden">
            <Link to="/tours">
              <Button variant="outline">Xem tất cả điểm đến</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured tours */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Tour nổi bật</h2>
              <p className="text-gray-600 mt-2">Những tour du lịch được đánh giá cao và yêu thích nhất</p>
            </div>
            <Link to="/tours" className="hidden md:flex items-center text-primary hover:underline">
              <span className="mr-1">Xem tất cả</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingFeatured ? (
              <div className="col-span-full flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : displayedFeaturedTours.length > 0 ? (
              displayedFeaturedTours.slice(0, 6).map((tour) => <TourCard key={tour.tourId} tour={tour} onClick={() => handleTourClick(tour.tourId)} />)
            ) : (
              <div className="col-span-full text-center text-gray-500">Không có tour nổi bật nào phù hợp với tiêu chí tìm kiếm.</div>
            )}
          </div>

          <div className="mt-8 flex justify-center md:hidden">
            <Link to="/tours">
              <Button variant="outline">Xem tất cả tour</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Why choose us */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại sao chọn TravelNow?</h2>
            <p className="text-gray-600">Chúng tôi cam kết mang đến cho bạn những trải nghiệm du lịch tuyệt vời với dịch vụ chất lượng cao và giá cả hợp lý.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đa dạng điểm đến</h3>
              <p className="text-gray-600">Hàng trăm tour du lịch đến các địa điểm nổi tiếng trong nước và quốc tế.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trải nghiệm độc đáo</h3>
              <p className="text-gray-600">Không chỉ tham quan, chúng tôi mang đến những trải nghiệm văn hóa, ẩm thực đặc sắc.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dịch vụ tận tâm</h3>
              <p className="text-gray-600">Đội ngũ nhân viên nhiệt tình, chu đáo luôn sẵn sàng hỗ trợ bạn mọi lúc.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <Coffee className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">An tâm tận hưởng</h3>
              <p className="text-gray-600">Mọi chi tiết đều được chuẩn bị kỹ lưỡng để bạn có thể thư giãn và tận hưởng kỳ nghỉ.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-gray-600">Đọc đánh giá từ những khách hàng đã trải nghiệm dịch vụ của TravelNow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Testimonial key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Nhận thông tin ưu đãi</h2>
            <p className="opacity-90 mb-8">Đăng ký nhận thông tin về các chương trình khuyến mãi, ưu đãi và tour du lịch mới nhất từ TravelNow.</p>

            <form className="flex flex-col sm:flex-row gap-4">
              <Input type="email" placeholder="Nhập email của bạn" className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/60" />
              <Button variant="secondary">Đăng ký</Button>
            </form>

            <p className="mt-4 text-sm opacity-80">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <a href="#" className="underline">
                Chính sách bảo mật
              </a>{" "}
              của chúng tôi.
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 rounded-xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Cần hỗ trợ hoặc tư vấn?</h2>
                <p className="text-gray-600 mb-6">Đội ngũ chuyên viên tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Liên hệ ngay để được tư vấn và đặt tour phù hợp với nhu cầu của bạn.</p>
                <div className="flex items-center text-primary font-medium">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>Hotline: 1900 1234</span>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <Link to="/contact">
                  <Button size="lg" className="px-8">
                    Liên hệ với chúng tôi
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
