import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown, Star, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance"; // Giả định bạn đã có file này
import { toast } from "react-toastify"; // Giả định bạn đã cài đặt react-toastify

const ManageReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviews, setReviews] = useState([]);

  const mapStatus = (backendStatus) => {
    switch (backendStatus) {
      case "CHO_DUYET":
        return "pending";
      case "DA_DUYET":
        return "approved";
      case "DA_TU_CHOI":
        return "rejected";
      default:
        return "pending"; // Mặc định là pending nếu trạng thái không hợp lệ
    }
  };

  // Lấy danh sách reviews từ API khi component được mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get("/tours/reviews");
        const fetchedReviews = response.data.result || [];
        // Ánh xạ trạng thái từ backend sang giao diện
        const mappedReviews = fetchedReviews.map((review) => ({
          ...review,
          status: mapStatus(review.status),
        }));
        console.log("Fetched reviews:", mappedReviews); // Debug log
        setReviews(mappedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Không thể tải danh sách đánh giá.");
      }
    };
    fetchReviews();
  }, []);
  // Filter reviews based on search term and status
  const filteredReviews = reviews.filter((review) => {
    const matchSearchTerm = review.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || review.name.toLowerCase().includes(searchTerm.toLowerCase()) || review.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "all" || review.status === statusFilter;

    return matchSearchTerm && matchStatus;
  });

  // Handle review approval/rejection
  const handleReviewStatus = async (reviewId, newStatus) => {
    try {
      const backendStatus = newStatus === "approved" ? "DA_DUYET" : "DA_TU_CHOI";
      const response = await axiosInstance.put(`/tours/reviews/${reviewId}/status?trangThai=${backendStatus}`);
      console.log(`Review ${reviewId} updated to ${newStatus}:`, response.data);
      toast.success(`Đã cập nhật trạng thái đánh giá thành ${newStatus === "approved" ? "Đã duyệt" : "Đã từ chối"}!`);

      // Reload danh sách reviews từ API để đảm bảo đồng bộ
      const updatedResponse = await axiosInstance.get("/tours/reviews");
      const updatedReviews = updatedResponse.data.result || [];
      const mappedUpdatedReviews = updatedReviews.map((review) => ({
        ...review,
        status: mapStatus(review.status),
      }));
      setReviews(mappedUpdatedReviews);
    } catch (error) {
      console.error(`Error updating review ${reviewId} to ${newStatus}:`, error);
      if (error.response) {
        toast.error(error.response.data.message || "Có lỗi xảy ra khi cập nhật trạng thái.");
      } else {
        toast.error("Không thể kết nối với máy chủ. Vui lòng thử lại.");
      }
    }
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setStatusFilter("all")} className={statusFilter === "all" ? "bg-gray-100" : ""}>
            Tất cả
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter("pending")} className={statusFilter === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}>
            Chờ duyệt
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter("approved")} className={statusFilter === "approved" ? "bg-green-50 text-green-700 border-green-200" : ""}>
            Đã duyệt
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter("rejected")} className={statusFilter === "rejected" ? "bg-red-50 text-red-700 border-red-200" : ""}>
            Đã từ chối
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input placeholder="Tìm kiếm đánh giá..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        {/* <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Lọc sao
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sắp xếp
          </Button>
        </div> */}
      </div>

      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.reviewId} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{review.fullName}</h3>
                  <div className="text-sm text-gray-500">{review.reviewDate}</div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mr-2 ${review.status === "approved" ? "bg-green-100 text-green-800" : review.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                    {review.status === "approved" ? "Đã duyệt" : review.status === "pending" ? "Chờ duyệt" : "Đã từ chối"}
                  </span>
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="mt-2">
                <div className="text-sm font-medium text-gray-700">
                  Tour: <span className="text-primary">{review.name}</span>
                </div>
                <p className="mt-2 text-gray-700">{review.content}</p>
              </div>

              {review.status === "pending" && (
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm" className="text-green-600 hover:text-green-800 hover:bg-green-50 border-green-200" onClick={() => handleReviewStatus(review.reviewId, "approved")}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Duyệt
                  </Button>

                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200" onClick={() => handleReviewStatus(review.reviewId, "rejected")}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Từ chối
                  </Button>
                </div>
              )}

              {review.status === "rejected" && (
                <div className="mt-4 bg-red-50 p-3 rounded-md border border-red-100">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Lý do từ chối</h4>
                      <p className="text-sm text-red-700">Vi phạm tiêu chuẩn cộng đồng: Đánh giá chứa thông tin tiêu cực, thiếu chính xác</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Không tìm thấy đánh giá nào phù hợp với điều kiện tìm kiếm</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị {filteredReviews.length} của {reviews.length} đánh giá
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Trước
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-white">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
