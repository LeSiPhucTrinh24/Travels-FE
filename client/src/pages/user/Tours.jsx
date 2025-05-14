import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Calendar, Users, Filter, ChevronDown, ChevronUp, Star, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleTours, initializeTourWithImage } from "@/lib/mockData";

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
      <img src={tour.imageUrl} alt={tour.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
      {tour.featured && <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Nổi bật</div>}
    </div>

    <div className="p-4">
      <h3 className="font-bold text-lg mb-1">{tour.name}</h3>
      <div className="flex items-center mb-2 text-gray-500 text-sm">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{tour.location}</span>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description.substring(0, 100)}...</p>

      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="font-bold text-lg text-primary">{formatCurrency(tour.price)}</span>
          <span className="text-gray-500 text-sm">/người</span>
        </div>
        <div className="text-gray-500 text-sm">{tour.duration}</div>
      </div>
    </div>
  </div>
);

const Tours = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialDestination = queryParams.get("destination") || "";

  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Filter state
  const [searchParams, setSearchParams] = useState({
    destination: initialDestination,
    date: "",
    people: "",
    minPrice: "",
    maxPrice: "",
    duration: [],
  });

  // Filter options
  const durationOptions = ["1-3 ngày", "4-7 ngày", "8-14 ngày", "15+ ngày"];

  // Fetch all tours
  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get tours
        const toursWithImages = sampleTours.map((tour) => initializeTourWithImage(tour));
        setTours(toursWithImages);
        setFilteredTours(toursWithImages);

        // Apply initial filter
        if (initialDestination) {
          applyFilters({ ...searchParams, destination: initialDestination });
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [initialDestination]);

  // Handle tour card click
  const handleTourClick = (tourId) => {
    navigate(`/tours/${tourId}`);
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    const newParams = { ...searchParams, [name]: value };
    setSearchParams(newParams);
  };

  // Handle duration filter change
  const handleDurationChange = (duration) => {
    const newDurations = [...searchParams.duration];
    const index = newDurations.indexOf(duration);

    if (index === -1) {
      newDurations.push(duration);
    } else {
      newDurations.splice(index, 1);
    }

    handleFilterChange("duration", newDurations);
  };

  // Apply filters
  const applyFilters = (params = searchParams) => {
    let results = [...tours];

    // Filter by destination
    if (params.destination) {
      results = results.filter((tour) => tour.location.toLowerCase().includes(params.destination.toLowerCase()));
    }

    // Filter by price range
    if (params.minPrice) {
      results = results.filter((tour) => tour.price >= parseFloat(params.minPrice));
    }

    if (params.maxPrice) {
      results = results.filter((tour) => tour.price <= parseFloat(params.maxPrice));
    }

    // Filter by duration
    if (params.duration.length > 0) {
      results = results.filter((tour) => {
        const dayCount = parseInt(tour.duration.split(" ")[0]);

        return params.duration.some((range) => {
          if (range === "1-3 ngày") return dayCount >= 1 && dayCount <= 3;
          if (range === "4-7 ngày") return dayCount >= 4 && dayCount <= 7;
          if (range === "8-14 ngày") return dayCount >= 8 && dayCount <= 14;
          if (range === "15+ ngày") return dayCount >= 15;
          return false;
        });
      });
    }

    setFilteredTours(results);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchParams({
      destination: "",
      date: "",
      people: "",
      minPrice: "",
      maxPrice: "",
      duration: [],
    });
    setFilteredTours(tours);
  };

  // Collapse/expand filters on mobile
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tour du lịch</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Bộ lọc
              </h2>
              <button onClick={toggleFilters} className="lg:hidden text-gray-500 hover:text-gray-700">
                {filtersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>

            {filtersOpen && (
              <form onSubmit={handleSearchSubmit}>
                <div className="space-y-6">
                  {/* Destination filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Điểm đến</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input value={searchParams.destination} onChange={(e) => handleFilterChange("destination", e.target.value)} placeholder="Bạn muốn đi đâu?" className="pl-10" />
                    </div>
                  </div>

                  {/* Date filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khởi hành</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input type="date" value={searchParams.date} onChange={(e) => handleFilterChange("date", e.target.value)} className="pl-10" />
                    </div>
                  </div>

                  {/* People filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số người</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <select value={searchParams.people} onChange={(e) => handleFilterChange("people", e.target.value)} className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="">Số người</option>
                        <option value="1">1 người</option>
                        <option value="2">2 người</option>
                        <option value="3">3 người</option>
                        <option value="4">4 người</option>
                        <option value="5+">5+ người</option>
                      </select>
                    </div>
                  </div>

                  {/* Price range filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Input type="number" placeholder="Tối thiểu" value={searchParams.minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} min="0" />
                      </div>
                      <div>
                        <Input type="number" placeholder="Tối đa" value={searchParams.maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} min="0" />
                      </div>
                    </div>
                  </div>

                  {/* Duration filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                    <div className="space-y-2">
                      {durationOptions.map((option) => (
                        <div key={option} className="flex items-center">
                          <input type="checkbox" id={`duration-${option}`} checked={searchParams.duration.includes(option)} onChange={() => handleDurationChange(option)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                          <label htmlFor={`duration-${option}`} className="ml-2 text-gray-700">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <Button type="button" variant="outline" onClick={resetFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                    <Button type="submit">
                      <Search className="h-4 w-4 mr-2" />
                      Lọc
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Tour list */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Results info */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Hiển thị {filteredTours.length} tour
                  {searchParams.destination && ` cho "${searchParams.destination}"`}
                </p>
                <div className="hidden md:block">
                  <select className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="recommended">Đề xuất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="duration-asc">Thời gian: Ngắn đến dài</option>
                    <option value="duration-desc">Thời gian: Dài đến ngắn</option>
                  </select>
                </div>
              </div>

              {filteredTours.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Không tìm thấy tour nào</h3>
                  <p className="text-gray-600 mb-6">Không có tour nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với bộ lọc khác.</p>
                  <Button onClick={resetFilters}>Xóa bộ lọc</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} onClick={() => handleTourClick(tour.id)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tours;
