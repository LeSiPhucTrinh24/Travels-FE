import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, MapPin, User, CreditCard, Clock, Search, ChevronDown, ChevronRight, FileText, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/hooks/AuthContext";
import { toast } from "react-toastify";

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

// Format date (updated to include time)
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Format as hour:minute:second day/month/year
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if formatting fails
  }
};

// Format date (date only)
const formatDateOnly = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Format as day/month/year
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if formatting fails
  }
};

// Booking Status Component (updated to handle integer status)
const BookingStatus = ({ status }) => {
  let bgColor, textColor, text;

  switch (status) {
    case 1:
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      text = "Đã xác nhận";
      break;
    case 2:
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      text = "Đã hủy";
      break;
    case 0:
    default:
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      text = "Đang chờ duyệt";
  }

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {/* Icon logic can be added here if needed, based on status value */}
      {text}
    </div>
  );
};

const Bookings = () => {
  // Use "all" for initial filter, other tabs will use numeric states 0, 1, 2
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const { user } = useAuth();

  // Fetch bookings from API
  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userBookings", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        const response = await axiosInstance.get(`/booking/user/${user.id}`);
        return response.data.result || [];
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Không thể tải danh sách đặt tour");
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Filter bookings based on active tab and search query
  const filteredBookings = bookings.filter((booking) => {
    // Match status based on numeric value from backend and active tab filter
    const matchesTab = activeTab === "all" || booking.status === activeTab;

    const matchesSearch = searchQuery === "" || (booking.tour?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (booking.tour?.destination || "").toLowerCase().includes(searchQuery.toLowerCase()) || (booking.bookingId || "").toString().includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  // Toggle booking details
  const toggleBookingDetails = (id) => {
    if (expandedBookingId === id) {
      setExpandedBookingId(null);
    } else {
      setExpandedBookingId(id);
    }
  };

  // Handle booking cancellation (now updates status to cancelled)
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn đặt tour này không?")) {
      try {
        // Call PUT API to update the booking status to cancelled (status 2)
        const response = await axiosInstance.put(`/booking/${bookingId}`, {
          status: 2, // Send the numeric status value for cancelled (2)
        });

        // Find the booking to get tour information
        const booking = bookings.find((b) => b.bookingId === bookingId);
        if (booking) {
          // Update tour's available slots
          const formData = new FormData();
          formData.append("name", booking.tour.name);
          formData.append("description", booking.tour.description);
          formData.append("price", booking.tour.price);
          formData.append("duration", booking.tour.duration);
          formData.append("departureDate", booking.tour.departureDate);
          formData.append("departureLocation", booking.tour.departureLocation);
          formData.append("maxPeople", booking.tour.maxPeople + booking.numberOfPeople); // Add back the cancelled slots
          formData.append("tourTypeId", booking.tour.tourTypeId);
          formData.append("status", booking.tour.status);
          formData.append("featured", booking.tour.featured);
          formData.append("coverImage", booking.tour.coverImage); // Add back the cover image

          await axiosInstance.put(`/tours/${booking.tourId}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          });
        }

        console.log("Booking status updated to cancelled:", response.data);
        toast.success("Đơn đặt tour đã được hủy thành công.");
        refetch(); // Refetch the bookings list to update the UI
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Không thể hủy đơn đặt tour. Vui lòng thử lại.");
      }
    }
  };

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-5xl mx-auto text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">Không thể tải danh sách đặt tour. Vui lòng thử lại sau.</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Đặt tour của tôi</h1>

        {/* Tabs (updated to use numeric values) */}
        <div className="flex border-b mb-6">
          <button className={`px-4 py-2 font-medium text-sm ${activeTab === "all" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("all")}>
            Tất cả
          </button>
          <button className={`px-4 py-2 font-medium text-sm ${activeTab === 1 ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab(1)}>
            Đã xác nhận
          </button>
          <button className={`px-4 py-2 font-medium text-sm ${activeTab === 0 ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab(0)}>
            Đang chờ duyệt
          </button>
          <button className={`px-4 py-2 font-medium text-sm ${activeTab === 2 ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab(2)}>
            Đã hủy
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Input type="text" placeholder="Tìm kiếm đặt tour..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Bookings list */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border animate-pulse p-4">
                <div className="flex items-center">
                  <div className="w-full sm:w-24 h-16 bg-gray-200 rounded mr-4"></div>

                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  </div>
                  <div className="w-24 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-gray-50 border rounded-lg p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-bold mb-2">
              {searchQuery ? "Không tìm thấy đặt tour phù hợp" : activeTab === "all" ? "Bạn chưa có đặt tour nào" : activeTab === 1 ? "Bạn chưa có đặt tour nào đã xác nhận" : activeTab === 0 ? "Bạn chưa có đặt tour nào đang chờ duyệt" : "Bạn chưa có đặt tour nào đã hủy"}
            </h3>
            <p className="text-gray-500 mb-4">{searchQuery ? "Vui lòng thử tìm kiếm với từ khóa khác" : "Hãy khám phá các tour du lịch hấp dẫn của chúng tôi"}</p>
            <Link to="/tours">
              <Button>Khám phá ngay</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.bookingId} className="overflow-hidden">
                <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleBookingDetails(booking.bookingId)}>
                  <div className="flex flex-col sm:flex-row items-start">
                    <div className="w-full sm:w-24 h-16 rounded-md bg-center bg-cover mb-4 sm:mb-0 sm:mr-4" style={{ backgroundImage: `url(${booking.tour?.coverImage})` }}></div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{booking.tour?.name}</h3>
                        {/* Pass numeric status to BookingStatus component */}
                        <BookingStatus status={booking.status} />
                      </div>

                      <div className="flex flex-col sm:flex-row text-sm text-gray-500 gap-y-1 sm:gap-x-4">
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span>{booking.tour?.destination}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span>Ngày đặt: {formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span>Ngày khởi hành: {formatDateOnly(booking.tour?.departureDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span>{booking.numberOfPeople} người</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 flex items-center">{expandedBookingId === booking.bookingId ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}</div>
                  </div>
                </div>

                {expandedBookingId === booking.bookingId && (
                  <div className="border-t px-4 py-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3">Thông tin đặt tour</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Mã đặt tour:</span>
                            <span className="font-medium">#{booking.bookingId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngày đặt:</span>
                            <span>{formatDate(booking.bookingDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngày khởi hành:</span>
                            <span>{formatDateOnly(booking.tour?.departureDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Khách hàng:</span>
                            <span className="font-medium">{user?.name || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Số người:</span>
                            <span>{booking.numberOfPeople} người</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-3">Thông tin thanh toán</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tổng tiền:</span>
                            <span className="font-medium">{formatCurrency(booking.totalPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Trạng thái:</span>
                            <span
                              className={`
                                ${booking.status === 1 ? "text-green-600" : booking.status === 0 ? "text-yellow-600" : "text-red-600"}
                              `}
                            >
                              {/* Display status text based on numeric value */}
                              {booking.status === 1 && "Đã xác nhận"}
                              {booking.status === 0 && "Đang chờ duyệt"}
                              {booking.status === 2 && "Đã hủy"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 justify-end">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>

                      {/* Show cancel button only if status is 0 (Pending) */}
                      {booking.status === 0 && (
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleCancelBooking(booking.bookingId)}>
                          <X className="h-4 w-4 mr-2" />
                          Hủy đặt tour
                        </Button>
                      )}

                      {/* Show rebook button if status is 2 (Cancelled) */}
                      {booking.status === 2 && (
                        <Link to={`/tours/${booking.tourId}`}>
                          <Button>Đặt lại tour này</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
