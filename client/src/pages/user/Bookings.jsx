import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, MapPin, User, CreditCard, Clock, Search, ChevronDown, ChevronRight, FileText, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample bookings data
const mockBookings = [
  {
    id: 1,
    tourId: 1,
    tourName: "Vịnh Hạ Long 2 ngày 1 đêm",
    location: "Hạ Long, Quảng Ninh",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300",
    bookingDate: "2025-05-01",
    travelDate: "2025-06-15",
    numTravelers: 2,
    totalAmount: 5980000,
    status: "confirmed",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
  },
  {
    id: 2,
    tourId: 3,
    tourName: "Đà Nẵng - Hội An 3 ngày",
    location: "Đà Nẵng, Hội An",
    imageUrl: "https://images.unsplash.com/photo-1540998871672-38471ce50502?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300",
    bookingDate: "2025-05-02",
    travelDate: "2025-06-20",
    numTravelers: 3,
    totalAmount: 7500000,
    status: "pending",
    paymentMethod: "bank_transfer",
    paymentStatus: "pending",
  },
  {
    id: 3,
    tourId: 2,
    tourName: "Phú Quốc - Đảo Ngọc",
    location: "Phú Quốc, Kiên Giang",
    imageUrl: "https://images.unsplash.com/photo-1582650406001-2a25e70c6f0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300",
    bookingDate: "2025-05-03",
    travelDate: "2025-07-01",
    numTravelers: 4,
    totalAmount: 8400000,
    status: "confirmed",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
  },
  {
    id: 4,
    tourId: 4,
    tourName: "Sapa - Thung lũng Mường Hoa",
    location: "Sapa, Lào Cai",
    imageUrl: "https://images.unsplash.com/photo-1577440708692-ab186b6bb00a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300",
    bookingDate: "2025-05-04",
    travelDate: "2025-06-25",
    numTravelers: 2,
    totalAmount: 5580000,
    status: "cancelled",
    paymentMethod: "credit_card",
    paymentStatus: "refunded",
  },
];

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const BookingStatus = ({ status }) => {
  let bgColor, textColor, icon;

  switch (status) {
    case "confirmed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <CheckCircle className="h-4 w-4 mr-1.5" />;
      break;
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      icon = <Clock className="h-4 w-4 mr-1.5" />;
      break;
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <X className="h-4 w-4 mr-1.5" />;
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      icon = <AlertCircle className="h-4 w-4 mr-1.5" />;
  }

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {status === "confirmed" && "Đã xác nhận"}
      {status === "pending" && "Đang chờ xác nhận"}
      {status === "cancelled" && "Đã hủy"}
    </div>
  );
};

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  // Simulating API call with React Query
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["/api/user/bookings"],
    queryFn: () => Promise.resolve(mockBookings),
    staleTime: Infinity,
  });

  // Filter bookings based on active tab and search query
  const filteredBookings = bookings.filter((booking) => {
    const matchesTab = activeTab === "all" || booking.status === activeTab;

    const matchesSearch = searchQuery === "" || booking.tourName.toLowerCase().includes(searchQuery.toLowerCase()) || booking.location.toLowerCase().includes(searchQuery.toLowerCase()) || booking.id.toString().includes(searchQuery);

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

  return (
    <div className="container-custom py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Đặt tour của tôi</h1>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button className={`px-4 py-2 font-medium text-sm ${activeTab === "all" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("all")}>
            Tất cả
          </button>
          <button className={`px-4 py-2 font-medium text-sm ${activeTab === "confirmed" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("confirmed")}>
            Đã xác nhận
          </button>
          <button className={`px-4 py-2 font-medium text-sm ${activeTab === "pending" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("pending")}>
            Đang chờ
          </button>
          <button className={`px-4 py-2 font-medium text-sm ${activeTab === "cancelled" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("cancelled")}>
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
                  <div className="w-24 h-16 bg-gray-200 rounded mr-4"></div>
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
            <h3 className="text-lg font-bold mb-2">{searchQuery ? "Không tìm thấy đặt tour phù hợp" : activeTab === "all" ? "Bạn chưa có đặt tour nào" : `Bạn chưa có đặt tour nào ${activeTab === "confirmed" ? "đã xác nhận" : activeTab === "pending" ? "đang chờ xác nhận" : "đã hủy"}`}</h3>
            <p className="text-gray-500 mb-4">{searchQuery ? "Vui lòng thử tìm kiếm với từ khóa khác" : "Hãy khám phá các tour du lịch hấp dẫn của chúng tôi"}</p>
            <Link to="/tours">
              <Button>Khám phá ngay</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleBookingDetails(booking.id)}>
                  <div className="flex flex-col sm:flex-row items-start">
                    <div className="w-full sm:w-24 h-16 rounded-md bg-center bg-cover mb-4 sm:mb-0 sm:mr-4" style={{ backgroundImage: `url(${booking.imageUrl})` }}></div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{booking.tourName}</h3>
                        <BookingStatus status={booking.status} />
                      </div>

                      <div className="flex flex-col sm:flex-row text-sm text-gray-500 gap-y-1 sm:gap-x-4">
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span>Ngày đi: {formatDate(booking.travelDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span>{booking.numTravelers} người</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 flex items-center">{expandedBookingId === booking.id ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}</div>
                  </div>
                </div>

                {expandedBookingId === booking.id && (
                  <div className="border-t px-4 py-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3">Thông tin đặt tour</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Mã đặt tour:</span>
                            <span className="font-medium">#{booking.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngày đặt:</span>
                            <span>{formatDate(booking.bookingDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngày khởi hành:</span>
                            <span>{formatDate(booking.travelDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Số người:</span>
                            <span>{booking.numTravelers} người</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-3">Thông tin thanh toán</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tổng tiền:</span>
                            <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Phương thức:</span>
                            <span>
                              {booking.paymentMethod === "credit_card" && "Thẻ tín dụng"}
                              {booking.paymentMethod === "bank_transfer" && "Chuyển khoản"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Trạng thái:</span>
                            <span
                              className={`
                              ${booking.paymentStatus === "paid" ? "text-green-600" : booking.paymentStatus === "pending" ? "text-yellow-600" : "text-red-600"}
                            `}
                            >
                              {booking.paymentStatus === "paid" && "Đã thanh toán"}
                              {booking.paymentStatus === "pending" && "Chờ thanh toán"}
                              {booking.paymentStatus === "refunded" && "Đã hoàn tiền"}
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

                      {booking.status === "pending" && (
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          <X className="h-4 w-4 mr-2" />
                          Hủy đặt tour
                        </Button>
                      )}

                      {booking.status === "confirmed" && (
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
