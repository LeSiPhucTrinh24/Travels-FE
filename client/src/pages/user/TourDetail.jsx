import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, Users, DollarSign, Star, Heart, Share2, CheckCircle, X, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/AuthContext";

// Utility function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

// Utility function to format date as "ngày/tháng/năm"
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Use padStart to ensure day and month are two digits
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
    const year = date.getFullYear();
    // Format as DD/MM/YYYY
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if formatting fails
  }
};

const TourDetail = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numTravelers, setNumTravelers] = useState(2);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [successfulBookingData, setSuccessfulBookingData] = useState(null);

  useEffect(() => {
    // Log to confirm useEffect is running
    console.log("TourDetail useEffect running for tourId:", tourId);
    const fetchTour = async () => {
      setIsLoading(true);
      try {
        // Log the tourId to check its value (already added)
        console.log("Fetching tour with ID:", tourId);
        const response = await axiosInstance.get(`/tours/${tourId}`);
        console.log("Tour data fetched successfully:", response.data);
        setTour(response.data.result);
      } catch (error) {
        console.error("Error fetching tour:", error);
        // Log detailed error response if available
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
        toast.error("Không thể tải thông tin tour");
        // Navigate to not-found only if a specific tour ID failed
        // If tourId is undefined initially, don't navigate here
        if (tourId) {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Add a check to ensure tourId is available before fetching
    if (tourId) {
      fetchTour();
      fetchAdditionalImages();
    }
  }, [tourId, navigate]);

  // Handle booking form submission
  const handleBooking = async (e) => {
    e.preventDefault();

    // Reset error and loading state
    setBookingError("");
    setIsBookingLoading(true);
    setSuccessfulBookingData(null);

    // Add validation for numTravelers
    if (!Number.isInteger(numTravelers) || numTravelers <= 0) {
      setBookingError("Số người phải là số nguyên dương.");
      setIsBookingLoading(false);
      return;
    }

    // Ensure user is logged in before proceeding
    if (!user?.id) {
      setBookingError("Vui lòng đăng nhập để đặt tour.");
      setIsBookingLoading(false);
      // Optionally, redirect to login page
      // navigate('/login');
      return;
    }

    try {
      const bookingData = {
        userId: user.id, // Use user.id directly after check
        tourId: tourId,
        numberOfPeople: numTravelers,
        totalPrice: calculateTotalPrice(),
        bookingDate: new Date().toISOString(), // Current date/time in ISO format
        status: false, // Set initial status to false (assuming backend handles this as initial/pending state)
      };

      // Log the data being sent
      console.log("Attempting to book tour with data:", bookingData);

      const response = await axiosInstance.post("/booking", bookingData);

      console.log("Booking successful:", response.data);
      setSuccessfulBookingData(response.data.result);
      toast.success("Đặt tour thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận.");
      setBookingSuccess(true);
    } catch (error) {
      console.error("Error booking tour:", error);

      // Log detailed error response if available
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        setBookingError(error.response.data.message || "Có lỗi xảy ra khi đặt tour. Vui lòng thử lại sau.");
        toast.error(error.response.data.message || "Có lỗi xảy ra khi đặt tour.");
      } else if (error.request) {
        console.error("Error request:", error.request);
        setBookingError("Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.");
        toast.error("Không nhận được phản hồi từ máy chủ.");
      } else {
        console.error("Error message:", error.message);
        setBookingError("Có lỗi xảy ra khi thiết lập yêu cầu đặt tour. Vui lòng thử lại.");
        toast.error("Có lỗi xảy ra khi thiết lập yêu cầu đặt tour.");
      }
      setBookingSuccess(false);
      setSuccessfulBookingData(null);
    } finally {
      setIsBookingLoading(false);
    }
  };

  // Handle review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual review submission
    console.log("Review submitted:", { rating: reviewRating, text: reviewText });
    toast.success("Cảm ơn bạn đã gửi đánh giá!");
    // Reset form
    setReviewRating(0);
    setReviewText("");
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!tour) return 0;
    return tour.price * numTravelers;
  };

  // Close booking modal and reset
  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingSuccess(false);
    setBookingError("");
    setSuccessfulBookingData(null);
  };

  // Handle favorite
  const handleFavorite = () => {
    toast.success("Đã thêm vào danh sách yêu thích!");
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: tour?.name,
          text: `Khám phá tour ${tour?.name} tại TravelNow!`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("URL đã được sao chép!");
    }
  };

  const fetchAdditionalImages = async () => {
    try {
      setIsLoadingImages(true);
      const response = await axiosInstance.get(`/tours/${tourId}/images`);
      // Assuming the backend returns an array of image objects with a 'url' property
      setAdditionalImages(response.data.result || []);
    } catch (error) {
      console.error("Error fetching additional images:", error);
      // Optional: Show a toast error if images fail to load
      // toast.error("Không thể tải thêm ảnh tour.");
    } finally {
      setIsLoadingImages(false);
    }
  };

  // Combine cover image and additional images for display
  const allTourImages = tour?.coverImage ? [{ url: tour.coverImage }, ...additionalImages] : [...additionalImages];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour không tồn tại</h2>
          <p className="mb-6">Tour bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => navigate("/tours")}>Quay lại danh sách tour</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tour header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{tour.name}</h1>
        <div className="flex flex-wrap items-center text-gray-600 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-primary" />
            <span>{tour.destination}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-primary" />
            <span>{tour.duration} ngày</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span className="mr-1">4.8</span>
            <span className="text-gray-500">(24 đánh giá)</span>
          </div>
        </div>
      </div>

      {/* Tour Images and Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left side - Tour Images */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Large image on the left */}
              <div className="col-span-1">
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">{allTourImages.length > 0 && <img src={allTourImages[activeImageIndex]?.url} alt={tour.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />}</div>
              </div>

              {/* 4 small images on the right */}
              <div className="col-span-1 grid grid-cols-2 grid-rows-2 gap-4">
                {allTourImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${activeImageIndex === index ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:opacity-90"}`}
                  >
                    <img src={image.url} alt={`${tour.name} - ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mb-6 space-x-2">
            <Button variant="outline" size="sm" onClick={handleFavorite}>
              <Heart className="h-4 w-4 mr-2" />
              Lưu tour
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>

        {/* Right side - Booking card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-2xl font-bold text-primary">{formatCurrency(tour.price)}</span>
                <span className="text-gray-500 text-sm"> / người</span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowBookingModal(true);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khởi hành</label>
                  <div className="relative flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                    {tour?.departureDate && <span className="text-base text-gray-800 font-semibold">{formatDate(tour?.departureDate)}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số người</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input type="number" value={numTravelers} onChange={(e) => setNumTravelers(parseInt(e.target.value) || 0)} min="1" className="pl-10" required />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span>Đơn giá</span>
                  <span>
                    {formatCurrency(tour.price)} x {numTravelers}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng tiền</span>
                  <span>{formatCurrency(calculateTotalPrice())}</span>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6">
                Đặt tour ngay
              </Button>

              <p className="text-xs text-gray-500 mt-4 text-center">Bạn chưa cần thanh toán ngay. Chúng tôi sẽ liên hệ với bạn để xác nhận và hướng dẫn thanh toán.</p>
            </form>
          </div>
        </div>
      </div>

      {/* Tour details section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Mô tả tour</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">{tour.description}</p>
            </div>
          </div>
        </div>

        {/* Two-column layout for details below description */}
        <div className="lg:col-span-2">
          {/* Highlights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Điểm nổi bật</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Tham quan các địa điểm nổi tiếng nhất tại {tour.destination}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Dịch vụ đưa đón tận nơi</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Hướng dẫn viên chuyên nghiệp, nhiệt tình</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Khách sạn tiêu chuẩn 4 sao</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Các bữa ăn theo lịch trình</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Vé tham quan tại các điểm đến</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Bảo hiểm du lịch</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Nước uống miễn phí mỗi ngày</span>
              </li>
            </ul>
          </div>

          {/* Itinerary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Lịch trình</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Ngày 1: Khởi hành - Khám phá</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex">
                    <span className="font-medium mr-2">07:00:</span>
                    <span>Đón khách tại điểm hẹn, khởi hành đi {tour.destination}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium mr-2">10:00:</span>
                    <span>Tham quan điểm du lịch đầu tiên</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium mr-2">12:00:</span>
                    <span>Ăn trưa tại nhà hàng địa phương</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium mr-2">14:00:</span>
                    <span>Tiếp tục tham quan các điểm du lịch</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium mr-2">18:00:</span>
                    <span>Ăn tối và nhận phòng khách sạn</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium mr-2">Tối:</span>
                    <span>Tự do khám phá {tour.destination} về đêm</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Ngày 2: Trải nghiệm văn hóa</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex">
                    <span className="font-medium mr-2">07:00:</span>
                    <span>Dùng điểm tâm sáng tại khách sạn</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium mr-2">08:30:</span>
                    <span>Tham quan các địa điểm văn hóa, lịch sử</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium mr-2">12:00:</span>
                    <span>Ăn trưa, nghỉ ngơi</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium mr-2">14:00:</span>
                    <span>Tham gia hoạt động trải nghiệm văn hóa địa phương</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium mr-2">18:00:</span>
                    <span>Ăn tối với đặc sản địa phương</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews in right column (placeholder) */}
      </div>
      {/* New Review Form Section */}
      <div className="lg:grid lg:grid-cols-2 gap-8 mt-12">
        {/* Cột trái - Viết đánh giá */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2 text-primary" />
            Viết đánh giá của bạn
          </h2>
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá sao</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-8 w-8 cursor-pointer ${star <= reviewRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} onClick={() => setReviewRating(star)} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét của bạn</label>
              <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn về tour" className="w-full" rows={4} required />
            </div>

            <Button type="submit" className="w-full">
              Gửi đánh giá
            </Button>
          </form>
        </div>

        {/* Cột phải - Hiển thị đánh giá từ khách hàng */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Đánh giá từ khách hàng</h2>

            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-semibold text-lg">4.8</span>
              </div>
              <span className="text-gray-600">(24 đánh giá)</span>
            </div>

            <div className="space-y-6">
              {/* Đánh giá 1 */}
              <div className="border-b pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">Nguyễn Văn A</h3>
                    <div className="text-sm text-gray-500">Tháng 5, 2025</div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">Chuyến đi tuyệt vời! Hướng dẫn viên rất thân thiện và chuyên nghiệp...</p>
              </div>

              {/* Đánh giá 2 */}
              <div className="border-b pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">Trần Thị B</h3>
                    <div className="text-sm text-gray-500">Tháng 4, 2025</div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">Dịch vụ rất tốt, lịch trình hợp lý...</p>
              </div>

              {/* Đánh giá 3 */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">Lê Văn C</h3>
                    <div className="text-sm text-gray-500">Tháng 3, 2025</div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">Đây là lần thứ ba tôi đặt tour qua đây...</p>
              </div>
            </div>

            <Button variant="outline" className="mt-6">
              Xem tất cả đánh giá
            </Button>
          </div>
        </div>
      </div>

      {/* Booking confirmation modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeBookingModal}>
              <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none" onClick={closeBookingModal}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              {bookingSuccess && successfulBookingData ? (
                <div className="px-6 pt-6 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Đặt tour thành công!</h3>
                    <p className="text-gray-600 mb-6">Dưới đây là thông tin chi tiết đặt tour của bạn. Chúng tôi sẽ liên hệ để xác nhận và hướng dẫn thanh toán.</p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full text-left">
                      <div className="font-medium text-lg mb-3">{tour?.name}</div>
                      <div className="space-y-2 text-gray-700 text-sm">
                        <div>
                          <span className="font-medium">Mã đặt tour:</span> #{successfulBookingData.bookingId}
                        </div>
                        <div>
                          <span className="font-medium">Ngày đặt:</span> {formatDate(successfulBookingData.bookingDate)}
                        </div>
                        <div>
                          <span className="font-medium">Ngày khởi hành:</span> {formatDate(tour?.departureDate)}
                        </div>
                        <div>
                          <span className="font-medium">Khách hàng:</span> {user?.name || "Bạn"}
                        </div>
                        <div>
                          <span className="font-medium">Số lượng:</span> {successfulBookingData.numberOfPeople} người
                        </div>
                        <div>
                          <span className="font-medium">Tổng tiền:</span> {formatCurrency(successfulBookingData.totalPrice)}
                        </div>
                        <div>
                          <span className="font-medium">Trạng thái:</span> <span className="text-yellow-700 font-semibold">Đang chờ xác nhận</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button onClick={() => navigate("/bookings")}>Xem đặt tour của tôi</Button>
                      <Button variant="outline" onClick={closeBookingModal}>
                        Đóng
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 pt-6 pb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận đặt tour</h3>

                  {bookingError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center text-sm">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="font-medium text-lg mb-2">{tour?.name}</div>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span>Ngày khởi hành:</span>
                        <span>{formatDate(tour?.departureDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số lượng:</span>
                        <span>{numTravelers} người</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                        <span>Tổng tiền:</span>
                        <span>{formatCurrency(calculateTotalPrice())}</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleBooking}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                        <Input type="text" placeholder="Nhập họ tên của bạn" value={user?.name || ""} required disabled={!!user?.name} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input type="email" placeholder="Nhập email của bạn" value={user?.userName || ""} required disabled={!!user?.userName} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <Input type="tel" placeholder="Nhập số điện thoại của bạn" value={user?.phone || ""} required disabled={!!user?.phone} />
                      </div>

                      <div className="flex items-start">
                        <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1" />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                          Tôi đồng ý với{" "}
                          <a href="#" className="text-primary hover:underline">
                            Điều khoản
                          </a>{" "}
                          và{" "}
                          <a href="#" className="text-primary hover:underline">
                            Chính sách
                          </a>{" "}
                          của TravelNow
                        </label>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <Button variant="outline" type="button" onClick={closeBookingModal}>
                        Hủy
                      </Button>
                      <Button type="submit" disabled={isBookingLoading}>
                        {isBookingLoading ? "Đang xử lý..." : "Xác nhận đặt tour"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;
