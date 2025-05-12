import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Filter, ArrowUpDown, Star } from 'lucide-react';
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

// Tour card component
const TourCard = ({ tour, onClick }) => (
  <div 
    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
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
    
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">{tour.name}</h3>
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

const Tours = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    destination: '',
    date: '',
    people: '',
    priceRange: [0, 5000000],
    duration: ''
  });
  
  // Get query params from URL (if any)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const destination = searchParams.get('destination') || '';
    
    setFilters(prev => ({
      ...prev,
      destination
    }));
  }, [location]);
  
  // Load tours data
  useEffect(() => {
    const loadTours = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Initialize tours with images
      const initializedTours = sampleTours.map(tour => initializeTourWithImage(tour));
      setTours(initializedTours);
      setIsLoading(false);
    };
    
    loadTours();
  }, []);
  
  // Apply filters to tours
  useEffect(() => {
    if (tours.length === 0) return;
    
    const filtered = tours.filter(tour => {
      const matchDestination = !filters.destination || 
        tour.location.toLowerCase().includes(filters.destination.toLowerCase());
      
      return matchDestination;
    });
    
    setFilteredTours(filtered);
  }, [tours, filters]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTourClick = (tourId) => {
    navigate(`/tours/${tourId}`);
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 sticky top-24">
          <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Điểm đến
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="destination"
                  name="destination"
                  type="text"
                  placeholder="Nhập địa điểm..."
                  className="pl-10"
                  value={filters.destination}
                  onChange={handleFilterChange}
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
                  name="date"
                  type="date"
                  className="pl-10"
                  value={filters.date}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-1">
                Số người
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="people"
                  name="people"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={filters.people}
                  onChange={handleFilterChange}
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
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian
              </label>
              <select
                id="duration"
                name="duration"
                className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.duration}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="1-2">1-2 ngày</option>
                <option value="3-4">3-4 ngày</option>
                <option value="5-7">5-7 ngày</option>
                <option value="8+">8+ ngày</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khoảng giá
              </label>
              <div className="flex items-center">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]]
                  }))}
                  className="w-full"
                />
                <span className="mx-2">-</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value) || 0]
                  }))}
                  className="w-full"
                />
              </div>
            </div>
            
            <Button className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Lọc kết quả
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Danh sách tour</h1>
            
            <div className="flex items-center">
              <div className="mr-4">
                <select
                  className="py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="popularity">Phổ biến nhất</option>
                  <option value="price_asc">Giá: Thấp đến cao</option>
                  <option value="price_desc">Giá: Cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
              
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Tìm kiếm tên tour, địa điểm..." 
                className="pl-10"
              />
            </div>
          </div>
          
          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} 
                  onClick={() => handleTourClick(tour.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Không tìm thấy tour nào</h3>
              <p className="text-gray-600 mb-4">
                Không tìm thấy tour phù hợp với điều kiện tìm kiếm. Vui lòng thử lại với điều kiện khác.
              </p>
              <Button
                onClick={() => setFilters({
                  destination: '',
                  date: '',
                  people: '',
                  priceRange: [0, 5000000],
                  duration: ''
                })}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium rounded-l-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              >
                Trước
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-primary text-white border border-primary"
              >
                1
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300"
              >
                2
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium rounded-r-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tours;