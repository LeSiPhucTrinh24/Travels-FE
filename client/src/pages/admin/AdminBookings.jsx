import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Filter, ArrowUpDown, CheckCircle, XCircle, Calendar } from "lucide-react";
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

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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

const ManageBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [realBookings, setRealBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [tourTypes, setTourTypes] = useState([]); // Add state for tour types

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 5 rows per page

  // Detail modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const response = await axiosInstance.get("/booking");
        setRealBookings(response.data.result);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Không thể tải danh sách đơn đặt tour.");
        setRealBookings([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    const fetchTourTypes = async () => {
      try {
        const response = await axiosInstance.get("/tourTypes");
        setTourTypes(response.data.result || []);
      } catch (error) {
        console.error("Error fetching tour types:", error);
      }
    };

    fetchBookings();
    fetchTourTypes();
  }, []);

  // Mapping backend status (integer 0, 1, 2) to desired string states
  const getBookingStatus = (booking) => {
    // Assuming backend now returns integer status: 0 for pending, 1 for confirmed, 2 for cancelled
    switch (booking.status) {
      case 1:
        return { value: 1, text: "Đã xác nhận", colorClass: "bg-green-100 text-green-800" }; // Confirmed
      case 2:
        return { value: 2, text: "Đã hủy", colorClass: "bg-red-100 text-red-800" }; // Cancelled
      case 0:
      default:
        return { value: 0, text: "Đang chờ duyệt", colorClass: "bg-yellow-100 text-yellow-800" }; // Pending (assuming 0 or other values map to pending)
    }
  };

  // Filter bookings based on search term and status
  const filteredBookings = realBookings.filter((booking) => {
    const matchSearchTerm = (booking.user?.fullName && booking.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) || (booking.tour?.name && booking.tour.name.toLowerCase().includes(searchTerm.toLowerCase())) || (booking.bookingId && booking.bookingId.toString().includes(searchTerm));

    // Get the mapped status value for filtering
    const bookingStatusValue = getBookingStatus(booking).value;

    // Filter logic using numeric values
    const matchStatus = statusFilter === "all" || bookingStatusValue === statusFilter;

    return matchSearchTerm && matchStatus;
  });

  // Pagination logic
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle opening detail modal
  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  // Handle closing detail modal
  const closeDetailModal = () => {
    setSelectedBooking(null);
    setShowDetailModal(false);
  };

  // Handler for status update
  const handleStatusUpdate = async (bookingId, newStatusValue) => {
    try {
      const statusToSendToBackend = newStatusValue; // Send the numeric value directly

      await axiosInstance.put(`/booking/${bookingId}`, {
        status: statusToSendToBackend,
      });

      setRealBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId
            ? {
                ...booking,
                status: newStatusValue, // Update local status directly with the new numeric value
                isCancelledUI: undefined, // Clear the temporary flag
              }
            : booking
        )
      );

      const successMessage = newStatusValue === 1 ? "Xác nhận đơn đặt tour thành công!" : "Hủy đơn đặt tour thành công!";
      toast.success(successMessage);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Không thể cập nhật trạng thái đơn đặt tour.");
    }
  };

  // Helper function to get tour type name by ID
  const getTourTypeName = (tourTypeId) => {
    const tourType = tourTypes.find((type) => type.tourTypeId === tourTypeId);
    return tourType ? tourType.tourTypeName : "N/A";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn đặt tour</h1>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setStatusFilter("all")} className={statusFilter === "all" ? "bg-gray-100" : ""}>
            Tất cả
          </Button>
          {/* Use numeric values for filter */}
          <Button variant="outline" onClick={() => setStatusFilter(0)} className={statusFilter === 0 ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}>
            Đang chờ duyệt
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter(1)} className={statusFilter === 1 ? "bg-green-50 text-green-700 border-green-200" : ""}>
            Đã xác nhận
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter(2)} className={statusFilter === 2 ? "bg-red-50 text-red-700 border-red-200" : ""}>
            Đã hủy
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-1/2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input placeholder="Tìm kiếm đơn đặt tour..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày khởi hành</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoadingBookings ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : currentBookings.length > 0 ? (
                currentBookings.map((booking, index) => {
                  // Calculate the actual STT based on the current page and index
                  const stt = indexOfFirstBooking + index + 1;
                  return (
                    <tr key={booking.bookingId} className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-900">{stt}</td>
                      <td className="py-4 px-4 text-sm">
                        <div className="font-medium text-gray-900">{booking.user?.fullName}</div>
                        {booking.user?.email && <div className="text-gray-500 text-xs">{booking.user.email}</div>}
                        {booking.user?.phone && <div className="text-gray-500 text-xs">{booking.user.phone}</div>}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{booking.tour?.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{formatDate(booking.bookingDate)}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{formatDateOnly(booking.departureDate) || "N/A"}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{booking.numberOfPeople} người</td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{formatCurrency(booking.totalPrice)}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {/* Display status using the mapping function */}
                        {(() => {
                          const status = getBookingStatus(booking);
                          return <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${status.colorClass}`}>{status.text}</span>;
                        })()}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="px-2" onClick={() => openDetailModal(booking)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Chi tiết
                          </Button>

                          {/* Show buttons only if status is 'Đang chờ duyệt' (value 0) */}
                          {getBookingStatus(booking).value === 0 && (
                            <>
                              <Button variant="ghost" size="sm" className="px-2 text-green-600 hover:text-green-800 hover:bg-green-50" onClick={() => handleStatusUpdate(booking.bookingId, 1)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Xác nhận
                              </Button>

                              <Button variant="ghost" size="sm" className="px-2 text-red-600 hover:text-red-800 hover:bg-red-50" onClick={() => handleStatusUpdate(booking.bookingId, 2)}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Hủy
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    Không tìm thấy đơn đặt tour nào phù hợp với điều kiện tìm kiếm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Hiển thị {indexOfFirstBooking + 1} đến {Math.min(indexOfLastBooking, filteredBookings.length)} của {filteredBookings.length} đơn đặt tour
          </div>
          {filteredBookings.length > itemsPerPage && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Trước
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? "bg-primary text-white" : ""}>
                  {index + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
                Sau
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Chi tiết đơn đặt tour #{selectedBooking.bookingId}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Left Column: Tour Image and basic info */}
              <div>
                {selectedBooking.tour?.coverImage && <img src={selectedBooking.tour.coverImage} alt="Tour Image" className="rounded-md w-full h-40 object-cover mb-4" />}
                <p className="text-sm text-gray-600">
                  <strong>Tên khách hàng:</strong> {selectedBooking.user?.fullName || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Loại tour:</strong> {getTourTypeName(selectedBooking.tour?.tourTypeId)}
                </p>
              </div>

              {/* Right Column: Detailed Booking Info */}
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Tên tour:</strong> {selectedBooking.tour?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Mô tả:</strong> {selectedBooking.tour?.description || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Ngày khởi hành:</strong> {formatDateOnly(selectedBooking.departureDate) || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Ngày đặt:</strong> {formatDate(selectedBooking.bookingDate) || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Số lượng:</strong> {selectedBooking.numberOfPeople} người
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tổng tiền:</strong> {formatCurrency(selectedBooking.totalPrice) || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Trạng thái:</strong> {getBookingStatus(selectedBooking).text}
                </p>
                {/* Display mapped status */}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={closeDetailModal}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
