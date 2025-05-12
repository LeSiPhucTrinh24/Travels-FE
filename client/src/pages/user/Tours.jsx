import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Filter, 
  SlidersHorizontal
} from 'lucide-react';
import SearchForm from '@/components/common/SearchForm';
import TourCard from '@/components/common/TourCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sampleTours, initializeTourWithImage } from '@/lib/mockData';

const Tours = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [duration, setDuration] = useState('all');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'all');
  
  // Simulating API call with React Query
  const { 
    data: tours = [], 
    isLoading 
  } = useQuery({
    queryKey: ['/api/tours'],
    queryFn: () => Promise.resolve(
      sampleTours.map(tour => initializeTourWithImage({
        ...tour, 
        id: Math.floor(Math.random() * 10000), // Random ID for demo purposes
        rating: (4 + Math.random()).toFixed(1) // Random rating between 4.0-5.0
      }))
    ),
    staleTime: Infinity,
  });
  
  // Apply filters
  const filteredTours = tours.filter(tour => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' ||
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by price range
    const matchesPrice = 
      tour.price >= priceRange[0] && 
      tour.price <= priceRange[1];
    
    // Filter by duration
    const matchesDuration = 
      duration === 'all' ||
      (duration === 'short' && tour.duration.includes('1 đêm')) ||
      (duration === 'medium' && tour.duration.includes('2 đêm')) ||
      (duration === 'long' && (tour.duration.includes('3 đêm') || tour.duration.includes('4 đêm')));
    
    // Filter by destination
    const matchesDestination = 
      destination === 'all' ||
      (destination === 'halong' && tour.location.toLowerCase().includes('hạ long')) ||
      (destination === 'danang' && tour.location.toLowerCase().includes('đà nẵng')) ||
      (destination === 'hoian' && tour.location.toLowerCase().includes('hội an')) ||
      (destination === 'sapa' && tour.location.toLowerCase().includes('sapa')) ||
      (destination === 'dalat' && tour.location.toLowerCase().includes('đà lạt')) ||
      (destination === 'phuquoc' && tour.location.toLowerCase().includes('phú quốc')) ||
      (destination === 'nhatrang' && tour.location.toLowerCase().includes('nha trang'));
    
    return matchesSearch && matchesPrice && matchesDuration && matchesDestination;
  });
  
  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    
    // In a real app, we would update the URL with search params
    // and refetch data based on the search query
  };
  
  // Set destination based on URL search params on initial load
  useEffect(() => {
    const destinationParam = searchParams.get('destination');
    if (destinationParam) {
      setDestination(destinationParam);
    }
  }, [searchParams]);
  
  return (
    <div>
      {/* Hero search section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="container-custom">
          <div className="text-center text-white mb-8">
            <h1 className="text-3xl font-bold mb-2">Tìm kiếm tour du lịch</h1>
            <p className="text-lg">Khám phá hàng trăm tour du lịch hấp dẫn với giá tốt nhất</p>
          </div>
          <SearchForm />
        </div>
      </div>
      
      {/* Main content */}
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar (on larger screens) or modal (on mobile) */}
          <div className={`${showFilters ? 'block' : 'hidden md:block'} w-full md:w-1/4 lg:w-1/5`}>
            <div className="bg-white rounded-lg border p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Bộ lọc</h2>
                <button 
                  className="md:hidden text-gray-500"
                  onClick={() => setShowFilters(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Khoảng giá</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
                    <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000000" 
                    step="500000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button 
                    className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
                    onClick={() => setPriceRange([0, 5000000])}
                  >
                    Dưới 5 triệu
                  </button>
                  <button 
                    className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
                    onClick={() => setPriceRange([5000000, 10000000])}
                  >
                    Từ 5-10 triệu
                  </button>
                </div>
              </div>
              
              {/* Duration */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Thời gian</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="duration" 
                      value="all"
                      checked={duration === 'all'}
                      onChange={() => setDuration('all')}
                      className="mr-2"
                    />
                    <span className="text-sm">Tất cả</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="duration" 
                      value="short"
                      checked={duration === 'short'}
                      onChange={() => setDuration('short')}
                      className="mr-2"
                    />
                    <span className="text-sm">1 ngày 1 đêm</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="duration" 
                      value="medium"
                      checked={duration === 'medium'}
                      onChange={() => setDuration('medium')}
                      className="mr-2"
                    />
                    <span className="text-sm">2 ngày 2 đêm</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="duration" 
                      value="long"
                      checked={duration === 'long'}
                      onChange={() => setDuration('long')}
                      className="mr-2"
                    />
                    <span className="text-sm">3 ngày trở lên</span>
                  </label>
                </div>
              </div>
              
              {/* Destinations */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Điểm đến</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="destination" 
                      value="all"
                      checked={destination === 'all'}
                      onChange={() => setDestination('all')}
                      className="mr-2"
                    />
                    <span className="text-sm">Tất cả</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="destination" 
                      value="halong"
                      checked={destination === 'halong'}
                      onChange={() => setDestination('halong')}
                      className="mr-2"
                    />
                    <span className="text-sm">Hạ Long</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="destination" 
                      value="danang"
                      checked={destination === 'danang'}
                      onChange={() => setDestination('danang')}
                      className="mr-2"
                    />
                    <span className="text-sm">Đà Nẵng</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="destination" 
                      value="hoian"
                      checked={destination === 'hoian'}
                      onChange={() => setDestination('hoian')}
                      className="mr-2"
                    />
                    <span className="text-sm">Hội An</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="destination" 
                      value="sapa"
                      checked={destination === 'sapa'}
                      onChange={() => setDestination('sapa')}
                      className="mr-2"
                    />
                    <span className="text-sm">Sapa</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="destination" 
                      value="dalat"
                      checked={destination === 'dalat'}
                      onChange={() => setDestination('dalat')}
                      className="mr-2"
                    />
                    <span className="text-sm">Đà Lạt</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="destination" 
                      value="phuquoc"
                      checked={destination === 'phuquoc'}
                      onChange={() => setDestination('phuquoc')}
                      className="mr-2"
                    />
                    <span className="text-sm">Phú Quốc</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="destination" 
                      value="nhatrang"
                      checked={destination === 'nhatrang'}
                      onChange={() => setDestination('nhatrang')}
                      className="mr-2"
                    />
                    <span className="text-sm">Nha Trang</span>
                  </label>
                </div>
              </div>
              
              <Button
                className="w-full" 
                onClick={() => {
                  // Reset filters
                  setPriceRange([0, 10000000]);
                  setDuration('all');
                  setDestination('all');
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {/* Search and filters */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <form 
                onSubmit={handleSearch}
                className="relative flex-1 min-w-[200px]"
              >
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên tour, địa điểm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="md:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
                
                <select 
                  className="rounded border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="featured">Nổi bật</option>
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>
            </div>
            
            {/* Tour results */}
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-1">Kết quả tìm kiếm</h2>
              <p className="text-gray-600 mb-4">Tìm thấy {filteredTours.length} tour phù hợp</p>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              ) : filteredTours.length === 0 ? (
                <div className="bg-gray-50 border rounded-lg p-8 text-center">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-bold mb-2">Không tìm thấy tour phù hợp</h3>
                  <p className="text-gray-500 mb-4">Vui lòng thử lại với bộ lọc khác</p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([0, 10000000]);
                      setDuration('all');
                      setDestination('all');
                    }}
                  >
                    Đặt lại bộ lọc
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {filteredTours.length > 0 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center space-x-1">
                  <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="px-3 py-1 border rounded bg-primary text-white">1</button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">4</button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">5</button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tours;