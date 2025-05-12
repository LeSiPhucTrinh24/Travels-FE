import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Check, 
  X, 
  Star, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { sampleTours, initializeTourWithImage, guideImages } from '@/lib/mockData';
import TourCard from '@/components/common/TourCard';

// Format price with thousand separators
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
};

const TourDetail = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [travelerCount, setTravelerCount] = useState(2);
  
  // Query for the specific tour
  const { 
    data: tour, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: [`/api/tours/${id}`],
    queryFn: () => {
      // Find the tour in sample data
      const foundTour = sampleTours.find(tour => tour.id === parseInt(id));
      if (!foundTour) {
        // If no tour found with the ID, use the first one as a fallback for demo
        const fallbackTour = sampleTours[0];
        return Promise.resolve(initializeTourWithImage({
          ...fallbackTour,
          id: parseInt(id) || 1,
          rating: 4.8,
          reviewCount: 24
        }));
      }
      
      return Promise.resolve(initializeTourWithImage({
        ...foundTour,
        rating: 4.8,
        reviewCount: 24
      }));
    },
    staleTime: Infinity,
  });
  
  // Query for related tours
  const { data: relatedTours = [] } = useQuery({
    queryKey: ['/api/tours/related'],
    queryFn: () => {
      return Promise.resolve(sampleTours.slice(0, 3).map(tour => initializeTourWithImage({
        ...tour,
        id: Math.floor(Math.random() * 10000),
        rating: (4 + Math.random()).toFixed(1)
      })));
    },
    staleTime: Infinity,
  });
  
  // Tour schedule data
  const schedule = [
    {
      day: 'Ngày 1',
      title: 'Khởi hành và khám phá',
      activities: [
        'Đón khách tại điểm hẹn',
        'Di chuyển đến điểm đến',
        'Check-in khách sạn',
        'Tham quan địa điểm nổi tiếng đầu tiên',
        'Ăn tối và nghỉ ngơi'
      ]
    },
    {
      day: 'Ngày 2',
      title: 'Trải nghiệm văn hóa địa phương',
      activities: [
        'Ăn sáng tại khách sạn',
        'Tham quan làng nghề truyền thống',
        'Trải nghiệm ẩm thực địa phương',
        'Khám phá các địa điểm du lịch nổi tiếng',
        'Ăn tối và xem biểu diễn văn hóa'
      ]
    },
    {
      day: 'Ngày 3',
      title: 'Khám phá thiên nhiên',
      activities: [
        'Ăn sáng tại khách sạn',
        'Tham quan danh lam thắng cảnh',
        'Picnic trưa tại địa điểm du lịch',
        'Tự do khám phá và mua sắm',
        'Ăn tối tại nhà hàng nổi tiếng'
      ]
    }
  ];
  
  // Included and excluded features
  const included = [
    'Hướng dẫn viên chuyên nghiệp',
    'Xe đưa đón theo lịch trình',
    'Khách sạn 3-4 sao',
    'Bữa ăn theo chương trình',
    'Vé tham quan các điểm du lịch',
    'Bảo hiểm du lịch',
    'Nước uống mỗi ngày'
  ];
  
  const excluded = [
    'Chi phí cá nhân & giặt ủi',
    'Đồ uống trong bữa ăn',
    'Chi phí tham quan ngoài chương trình',
    'Phụ thu phòng đơn',
    'Tiền tip cho hướng dẫn viên và tài xế'
  ];
  
  // Tour guide data
  const guide = {
    name: 'Nguyễn Hướng Dẫn Viên',
    experience: '5 năm kinh nghiệm',
    image: guideImages.guide1,
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    rating: 4.9,
    reviews: 86
  };
  
  // Handle booking
  const handleBooking = () => {
    console.log('Booking tour with ID:', id);
    alert('Chức năng đặt tour sẽ được triển khai trong phiên bản tiếp theo!');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container-custom py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-80 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError || !tour) {
    return (
      <div className="container-custom py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Không tìm thấy thông tin tour
          </h2>
          <p className="text-red-600 mb-6">
            Rất tiếc, chúng tôi không thể tìm thấy thông tin tour bạn đang tìm kiếm.
          </p>
          <Link to="/tours">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách tour
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 border-b">
        <div className="container-custom">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link to="/tours" className="text-gray-500 hover:text-primary">Tour</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-800 font-medium truncate">{tour.name}</span>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Tour header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{tour.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center text-gray-700">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              <span>{tour.location}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="h-4 w-4 mr-1 text-primary" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(tour.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-700">
                {tour.rating} ({tour.reviewCount} đánh giá)
              </span>
            </div>
          </div>
        </div>
        
        {/* Tour image */}
        <div className="rounded-lg overflow-hidden mb-10 h-[500px]">
          <img 
            src={tour.imageUrl} 
            alt={tour.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Tour details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="schedule">Lịch trình</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Thông tin chuyến đi</h2>
                    <p className="text-gray-700 mb-4">
                      {tour.description}
                    </p>
                    <p className="text-gray-700">
                      Đây là một trải nghiệm du lịch hoàn hảo, phù hợp với những người yêu thích khám phá văn hóa,
                      thiên nhiên và ẩm thực địa phương. Bạn sẽ được tham quan các địa điểm nổi tiếng, thưởng thức 
                      ẩm thực đặc sản và trải nghiệm các hoạt động thú vị trong suốt chuyến đi.
                    </p>
                  </div>
                  
                  {/* Highlights */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Điểm nhấn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex text-primary mb-2">
                          <MapPin className="h-5 w-5 mr-2" />
                          <h3 className="font-bold">Địa điểm nổi tiếng</h3>
                        </div>
                        <p className="text-gray-700">
                          Tham quan các địa điểm du lịch nổi tiếng và hấp dẫn nhất của vùng.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex text-primary mb-2">
                          <Users className="h-5 w-5 mr-2" />
                          <h3 className="font-bold">Hướng dẫn viên chuyên nghiệp</h3>
                        </div>
                        <p className="text-gray-700">
                          Được đồng hành bởi đội ngũ hướng dẫn viên giàu kinh nghiệm.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex text-primary mb-2">
                          <Calendar className="h-5 w-5 mr-2" />
                          <h3 className="font-bold">Lịch trình linh hoạt</h3>
                        </div>
                        <p className="text-gray-700">
                          Lịch trình được thiết kế hợp lý với thời gian tham quan và nghỉ ngơi.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex text-primary mb-2">
                          <Star className="h-5 w-5 mr-2" />
                          <h3 className="font-bold">Trải nghiệm đặc sắc</h3>
                        </div>
                        <p className="text-gray-700">
                          Tham gia các hoạt động văn hóa và trải nghiệm đặc biệt của địa phương.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Included/Excluded */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Dịch vụ bao gồm & không bao gồm</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-green-600 mb-3 flex items-center">
                          <Check className="h-5 w-5 mr-2" />
                          Bao gồm trong tour
                        </h3>
                        <ul className="space-y-2">
                          {included.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-red-600 mb-3 flex items-center">
                          <X className="h-5 w-5 mr-2" />
                          Không bao gồm
                        </h3>
                        <ul className="space-y-2">
                          {excluded.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <X className="h-4 w-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tour Guide */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Hướng dẫn viên</h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <img 
                          src={guide.image} 
                          alt={guide.name}
                          className="w-20 h-20 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{guide.name}</h3>
                          <p className="text-gray-600 mb-1">{guide.experience}</p>
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.floor(guide.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-700">
                              {guide.rating} ({guide.reviews} đánh giá)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="mb-2 text-sm font-medium">Ngôn ngữ:</div>
                        <div className="flex flex-wrap gap-2">
                          {guide.languages.map((language, index) => (
                            <Badge key={index} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Schedule Tab */}
              <TabsContent value="schedule">
                <div>
                  <h2 className="text-xl font-bold mb-4">Lịch trình chi tiết</h2>
                  <div className="space-y-6">
                    {schedule.map((day, index) => (
                      <div key={index} className="relative">
                        {/* Timeline connector */}
                        {index < schedule.length - 1 && (
                          <div className="absolute top-12 left-6 bottom-0 w-0.5 bg-gray-200"></div>
                        )}
                        
                        <div className="flex">
                          {/* Day indicator */}
                          <div className="relative z-10">
                            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                              <span className="text-sm font-bold">{index + 1}</span>
                            </div>
                          </div>
                          
                          {/* Day content */}
                          <div className="ml-4 pb-6">
                            <h3 className="font-bold text-lg">{day.day}: {day.title}</h3>
                            <div className="mt-3 bg-gray-50 rounded-lg p-4">
                              <ul className="space-y-3">
                                {day.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-3">
                                      {actIndex + 1}
                                    </span>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Đánh giá từ khách hàng</h2>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < Math.floor(tour.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-bold">
                        {tour.rating}
                      </span>
                      <span className="ml-1 text-gray-600">
                        ({tour.reviewCount} đánh giá)
                      </span>
                    </div>
                  </div>
                  
                  {/* Review list - these are mock reviews */}
                  <div className="space-y-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center mb-3">
                          <img 
                            src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${20 + index}.jpg`} 
                            alt="Reviewer"
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <h4 className="font-bold">Khách hàng {index + 1}</h4>
                            <div className="text-sm text-gray-500">Đã đi tour vào tháng {5 - index}/2023</div>
                          </div>
                        </div>
                        <div className="flex mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 5 - index % 2 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">
                          {index === 0 && "Tour rất tuyệt vời, hướng dẫn viên nhiệt tình và chuyên nghiệp. Cảnh đẹp, ăn ngon, khách sạn sạch sẽ. Tôi sẽ tiếp tục đặt tour tại đây."}
                          {index === 1 && "Chuyến đi thú vị, mọi thứ đều tốt như mong đợi. Hướng dẫn viên rất am hiểu về lịch sử và văn hóa địa phương, giúp chúng tôi hiểu thêm về nơi mình đến."}
                          {index === 2 && "Trải nghiệm đáng nhớ với phong cảnh tuyệt đẹp. Tuy nhiên, lịch trình hơi gấp rút, hy vọng có thêm thời gian tự do khám phá hơn. Nhìn chung, vẫn là một chuyến đi tốt."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column: Booking card */}
          <div>
            <div className="sticky top-20">
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {formatPrice(tour.price)} 
                    <span className="text-sm font-normal text-gray-600">/người</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3.5 w-3.5 ${i < Math.floor(tour.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs">
                        ({tour.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Available dates - In a real app, these would be fetched from an API */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Chọn ngày khởi hành
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["01/06/2025", "15/06/2025", "01/07/2025", "15/07/2025"].map((date, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`
                              border rounded-md px-3 py-2 text-sm transition-colors
                              ${selectedDate === date 
                                ? 'bg-primary text-white border-primary' 
                                : 'border-gray-300 hover:border-primary'
                              }
                            `}
                            onClick={() => setSelectedDate(date)}
                          >
                            {date}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Traveler count */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Số lượng khách
                      </label>
                      <div className="flex border rounded-md">
                        <button
                          type="button"
                          className="px-4 py-2 border-r"
                          onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                          disabled={travelerCount <= 1}
                        >
                          -
                        </button>
                        <div className="flex-1 flex items-center justify-center">
                          {travelerCount}
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 border-l"
                          onClick={() => setTravelerCount(Math.min(10, travelerCount + 1))}
                          disabled={travelerCount >= 10}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Price breakdown */}
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between">
                        <span>Đơn giá</span>
                        <span>{formatPrice(tour.price)} x {travelerCount}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Tổng cộng</span>
                        <span>{formatPrice(tour.price * travelerCount)}</span>
                      </div>
                    </div>
                    
                    {/* Booking button */}
                    <Button 
                      className="w-full"
                      onClick={handleBooking}
                      disabled={!selectedDate}
                    >
                      Đặt tour
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Bạn sẽ không bị trừ tiền vào lúc này
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related tours */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Tour tương tự</h2>
            <Link to="/tours">
              <Button variant="outline">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTours.map((relatedTour) => (
              <TourCard key={relatedTour.id} tour={relatedTour} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;