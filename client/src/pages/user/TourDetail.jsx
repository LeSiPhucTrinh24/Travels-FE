import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  Share2, 
  CheckCircle,
  X,
  Info,
  Image
} from 'lucide-react';
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

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [numTravelers, setNumTravelers] = useState(1);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  
  // Mock additional image data
  const additionalImages = [
    'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1540998871672-38471ce50502?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1582650406001-2a25e70c6f0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1577440708692-ab186b6bb00a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
  ];
  
  // Mock testimonials
  const reviews = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      comment: 'Chuyến đi tuyệt vời! Hướng dẫn viên rất thân thiện và chuyên nghiệp. Cảnh đẹp, ăn ngon, khách sạn sạch sẽ. Tôi sẽ tiếp tục đặt tour tại đây trong tương lai.',
      rating: 5,
      date: '2025-04-15'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      comment: 'Dịch vụ rất tốt, lịch trình hợp lý. Tuy nhiên, khách sạn có thể tốt hơn một chút. Nhìn chung tôi vẫn rất hài lòng với chuyến đi.',
      rating: 4,
      date: '2025-04-10'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      comment: 'Đây là lần thứ ba tôi đặt tour qua đây và chưa bao giờ thất vọng. Chất lượng dịch vụ luôn ổn định và đáng tin cậy.',
      rating: 5,
      date: '2025-04-05'
    },
  ];
  
  // Mock itinerary
  const itinerary = [
    {
      day: 1,
      title: 'Khởi hành - Khám phá Vịnh Hạ Long',
      activities: [
        '7:00 - 8:00: Đón khách tại khách sạn ở Hà Nội',
        '8:00 - 12:00: Di chuyển đến Vịnh Hạ Long',
        '12:00 - 13:30: Nhận phòng và dùng bữa trưa trên tàu',
        '14:00 - 17:00: Khám phá hang Sửng Sốt, đảo Ti Tốp',
        '18:00 - 19:30: Ăn tối trên tàu',
        '20:00 - 22:00: Tự do câu mực đêm hoặc nghỉ ngơi'
      ]
    },
    {
      day: 2,
      title: 'Khám phá Vịnh Lan Hạ - Trở về Hà Nội',
      activities: [
        '6:00 - 7:30: Tập Tai Chi trên boong tàu và ăn sáng',
        '8:00 - 9:30: Tham quan làng chài Cửa Vạn',
        '10:00 - 11:00: Trả phòng và dùng bữa trưa',
        '12:00 - 16:00: Di chuyển về Hà Nội',
        '16:00 - 17:00: Kết thúc tour, đưa khách về khách sạn'
      ]
    }
  ];
  
  // Load tour data from mock data
  useEffect(() => {
    // Simulating API call
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Find tour in sample data
      const tourData = sampleTours.find(
        t => t.id === parseInt(id) || t.id === id
      );
      
      if (tourData) {
        // Initialize with image
        setTour(initializeTourWithImage({
          ...tourData,
          rating: "4.8",
          reviewCount: 24,
          additionalImages,
          reviews,
          itinerary
        }));
      } else {
        // Generate a random tour for demo
        setTour(initializeTourWithImage({
          id,
          name: 'Vịnh Hạ Long 2 ngày 1 đêm',
          location: 'Hạ Long, Quảng Ninh',
          description: 'Khám phá vẻ đẹp huyền bí của Vịnh Hạ Long - Di sản thiên nhiên thế giới được UNESCO công nhận với hàng nghìn hòn đảo đá vôi, hang động kỳ thú và bãi biển hoang sơ. Tour bao gồm tàu thăm quan Vịnh, các bữa ăn, hướng dẫn viên và nhiều hoạt động thú vị.',
          price: 1790000,
          duration: '2 ngày 1 đêm',
          featured: true,
          rating: "4.8",
          reviewCount: 24,
          additionalImages,
          reviews,
          itinerary
        }));
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [id]);
  
  const handleBookNow = () => {
    console.log('Booking tour:', {
      tourId: id,
      selectedDate,
      numTravelers
    });
    
    setShowBookingSuccess(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setShowBookingSuccess(false);
    }, 5000);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="mb-4">
            <Info className="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Tour không tồn tại</h2>
          <p className="text-gray-600 mb-6">
            Tour bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/tours">
            <Button>Xem tất cả tour</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Tour Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{tour.name}</h1>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{tour.location}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span>{tour.rating}</span>
                  <span className="text-sm ml-1">({tour.reviewCount} đánh giá)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="ghost" className="text-white border border-white hover:bg-white/20">
                <Heart className="h-4 w-4 mr-2" />
                <span>Lưu</span>
              </Button>
              <Button variant="ghost" className="text-white border border-white hover:bg-white/20">
                <Share2 className="h-4 w-4 mr-2" />
                <span>Chia sẻ</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main tour content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[400px]">
              <div className="col-span-1 row-span-2">
                <img 
                  src={tour.imageUrl} 
                  alt={tour.name}
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>
              <div className="col-span-1 row-span-1">
                <img 
                  src={tour.additionalImages[1]} 
                  alt={`${tour.name} 2`}
                  className="w-full h-full object-cover rounded-tr-lg"
                />
              </div>
              <div className="col-span-1 row-span-1 relative group">
                <img 
                  src={tour.additionalImages[2]} 
                  alt={`${tour.name} 3`}
                  className="w-full h-full object-cover rounded-br-lg"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-br-lg">
                  <div className="text-white text-center">
                    <Image className="h-6 w-6 mx-auto mb-1" />
                    <span>Xem tất cả ảnh</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tour overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Tổng quan</h2>
              <div className="bg-white rounded-lg shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <Clock className="h-6 w-6 text-primary mb-2" />
                  <h3 className="text-sm font-semibold">Thời gian</h3>
                  <p className="text-gray-600">{tour.duration}</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <MapPin className="h-6 w-6 text-primary mb-2" />
                  <h3 className="text-sm font-semibold">Điểm đến</h3>
                  <p className="text-gray-600">{tour.location}</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="h-6 w-6 text-primary mb-2" />
                  <h3 className="text-sm font-semibold">Nhóm</h3>
                  <p className="text-gray-600">10-20 người</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <Calendar className="h-6 w-6 text-primary mb-2" />
                  <h3 className="text-sm font-semibold">Khởi hành</h3>
                  <p className="text-gray-600">Hàng ngày</p>
                </div>
              </div>
            </div>
            
            {/* Tour description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Mô tả</h2>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-700 leading-relaxed">
                  {tour.description}
                </p>
              </div>
            </div>
            
            {/* Tour itinerary */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Lịch trình</h2>
              <div className="bg-white rounded-lg shadow-sm p-6">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="mb-6 last:mb-0">
                    <h3 className="text-lg font-bold mb-3">Ngày {day.day}: {day.title}</h3>
                    <ul className="space-y-2">
                      {day.activities.map((activity, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reviews */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Đánh giá</h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-bold text-lg">{tour.rating}</span>
                  <span className="text-gray-600 ml-1">({tour.reviewCount} đánh giá)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {tour.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start">
                      <img 
                        src={review.avatar} 
                        alt={review.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold">{review.name}</h3>
                          <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Button variant="outline">Xem tất cả đánh giá</Button>
              </div>
            </div>
          </div>
          
          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-3xl font-bold text-primary">{formatCurrency(tour.price)}</span>
                  <span className="text-gray-500">/người</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                  <span className="text-sm text-green-600">Còn chỗ</span>
                </div>
              </div>
              
              {showBookingSuccess ? (
                <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <h4 className="font-semibold">Đặt tour thành công!</h4>
                      <p className="text-sm mt-1">
                        Thông tin chi tiết đã được gửi vào email của bạn.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày khởi hành
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng người
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={numTravelers}
                        onChange={(e) => setNumTravelers(parseInt(e.target.value))}
                        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} người
                          </option>
                        ))}
                        <option value="11">Trên 10 người</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Đơn giá</span>
                      <span>{formatCurrency(tour.price)} × {numTravelers}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatCurrency(tour.price * numTravelers)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full"
                    onClick={handleBookNow}
                    disabled={!selectedDate}
                  >
                    Đặt ngay
                  </Button>
                </form>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  <button className="text-primary underline">Liên hệ với chúng tôi</button> nếu bạn có thắc mắc
                </p>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-3">Bao gồm</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1.5 mt-1" />
                    <span className="text-sm">Vé tham quan các điểm trong chương trình</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1.5 mt-1" />
                    <span className="text-sm">Hướng dẫn viên suốt tuyến</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1.5 mt-1" />
                    <span className="text-sm">Ăn các bữa theo chương trình</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1.5 mt-1" />
                    <span className="text-sm">Phương tiện di chuyển</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-3">Không bao gồm</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <X className="h-4 w-4 text-red-500 mr-1.5 mt-1" />
                    <span className="text-sm">Chi phí cá nhân ngoài chương trình</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-4 w-4 text-red-500 mr-1.5 mt-1" />
                    <span className="text-sm">Phụ thu phòng đơn (nếu có)</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-4 w-4 text-red-500 mr-1.5 mt-1" />
                    <span className="text-sm">Đồ uống trong các bữa ăn</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;