import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Calendar, Users, Filter, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Slider from "@radix-ui/react-slider";
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
        <span>{tour.destination}</span>
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

const Tours = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialDestination = queryParams.get("destination") || "";

  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [tourTypes, setTourTypes] = useState([]);

  // Filter state
  const [searchParams, setSearchParams] = useState({
    destination: initialDestination,
    date: "",
    people: "",
    minPrice: "",
    maxPrice: "",
    minDuration: "",
    maxDuration: "",
    tourTypeId: "",
  });

  // Price range options
  const priceRanges = [
    { label: "Dưới 1 triệu", min: 0, max: 1000000 },
    { label: "1 - 3 triệu", min: 1000000, max: 3000000 },
    { label: "3 - 5 triệu", min: 3000000, max: 5000000 },
    { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
    { label: "Trên 10 triệu", min: 10000000, max: Infinity },
  ];

  // Get min and max price from all tours
  const getPriceRange = () => {
    if (tours.length === 0) return { min: 0, max: 10000000 };
    const prices = tours.map((tour) => tour.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const [priceRange, setPriceRange] = useState(getPriceRange());

  // Update price range when tours change
  useEffect(() => {
    setPriceRange(getPriceRange());
  }, [tours]);

  // Handle price range change
  const handlePriceRangeChange = (values) => {
    setSearchParams((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }));
  };

  // Fetch all tours
  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/tours");
        const currentDate = new Date();

        const activeTours = response.data.result
          .map((tour) => {
            const departureDate = new Date(tour.departureDate);
            const isExpired = departureDate < currentDate;

            if (isExpired && (tour.status === true || tour.status === "true")) {
              axiosInstance
                .put(
                  `/tours/${tour.tourId}`,
                  {
                    ...tour,
                    status: false,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "multipart/form-data",
                    },
                  }
                )
                .catch((error) => {
                  console.error("Error updating tour status:", error);
                });
            }

            return {
              ...tour,
              status: !isExpired && (tour.status === true || tour.status === "true"),
            };
          })
          .filter((tour) => tour.status === true);

        setTours(activeTours);
        setFilteredTours(activeTours);
      } catch (error) {
        console.error("Error fetching tours:", error);
        toast.error("Không thể tải danh sách tour");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Fetch tour types
  useEffect(() => {
    const fetchTourTypes = async () => {
      try {
        const response = await axiosInstance.get("/tourTypes");
        setTourTypes(response.data.result || []);
      } catch (error) {
        console.error("Error fetching tour types:", error);
        toast.error("Không thể tải danh sách loại tour");
      }
    };

    fetchTourTypes();
  }, []);

  // Tự động áp dụng bộ lọc khi searchParams thay đổi
  useEffect(() => {
    applyFilters(searchParams);
  }, [searchParams, tours]); // Chạy lại khi searchParams hoặc tour du lịch thay đổi

  // Handle tour card click
  const handleTourClick = (tourId) => {
    navigate(`/tours/${tourId}`);
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    const newParams = { ...searchParams, [name]: value };
    setSearchParams(newParams);
  };

  // Apply filters
  const applyFilters = (params = searchParams) => {
    let results = [...tours];

    // Filter by destination
    if (params.destination) {
      results = results.filter((tour) => tour.destination.toLowerCase().includes(params.destination.toLowerCase()));
    }

    // Filter by tour type
    if (params.tourTypeId) {
      results = results.filter((tour) => tour.tourTypeId === params.tourTypeId);
    }

    // Filter by date
    if (params.date) {
      const selectedDate = new Date(params.date);
      results = results.filter((tour) => {
        const tourDate = new Date(tour.departureDate);
        return tourDate >= selectedDate;
      });
    }

    // Filter by price range
    if (params.minPrice) {
      results = results.filter((tour) => tour.price >= parseFloat(params.minPrice));
    }
    if (params.maxPrice) {
      results = results.filter((tour) => tour.price <= parseFloat(params.maxPrice));
    }

    // Filter by duration
    if (params.minDuration) {
      results = results.filter((tour) => parseInt(tour.duration) >= parseInt(params.minDuration));
    }
    if (params.maxDuration) {
      results = results.filter((tour) => parseInt(tour.duration) <= parseInt(params.maxDuration));
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
      minDuration: "",
      maxDuration: "",
      tourTypeId: "",
    });
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
                  {/* Tour type filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại tour</label>
                    <div className="relative">
                      <select value={searchParams.tourTypeId} onChange={(e) => handleFilterChange("tourTypeId", e.target.value)} className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="">--Chọn loại tour--</option>
                        {tourTypes.map((type) => (
                          <option key={type.tourTypeId} value={type.tourTypeId}>
                            {type.tourTypeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

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
                        <option value="5">5 người</option>
                        <option value="6">6 người</option>
                        <option value="7">7 người</option>
                        <option value="8">8 người</option>
                        <option value="9">9 người</option>
                        <option value="10+">10+ người</option>
                      </select>
                    </div>
                  </div>

                  {/* Price range filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
                    <div className="px-2">
                      <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" value={[searchParams.minPrice || priceRange.min, searchParams.maxPrice || priceRange.max]} onValueChange={handlePriceRangeChange} max={priceRange.max} min={priceRange.min} step={100000}>
                        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                          <Slider.Range className="absolute bg-primary rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Min price" />
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Max price" />
                      </Slider.Root>
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>{formatCurrency(searchParams.minPrice || priceRange.min)}</span>
                        <span>{formatCurrency(searchParams.maxPrice || priceRange.max)}</span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {priceRanges.map((range) => (
                        <button
                          key={range.label}
                          type="button"
                          onClick={() => {
                            setSearchParams((prev) => ({
                              ...prev,
                              minPrice: range.min,
                              maxPrice: range.max === Infinity ? priceRange.max : range.max,
                            }));
                          }}
                          className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${searchParams.minPrice === range.min && (searchParams.maxPrice === range.max || (range.max === Infinity && !searchParams.maxPrice)) ? "bg-primary/10 text-primary" : "text-gray-600"}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian (số ngày)</label>
                    <div className="flex space-x-4">
                      <Input type="number" placeholder="Từ" value={searchParams.minDuration} onChange={(e) => handleFilterChange("minDuration", e.target.value)} min="0" className="w-1/2" />
                      <Input type="number" placeholder="Đến" value={searchParams.maxDuration} onChange={(e) => handleFilterChange("maxDuration", e.target.value)} min="0" className="w-1/2" />
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
                    <TourCard key={tour.tourId} tour={tour} onClick={() => handleTourClick(tour.tourId)} />
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
