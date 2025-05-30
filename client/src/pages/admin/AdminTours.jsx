import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Eye, Filter, ArrowUpDown } from "lucide-react";
import AdminTourDetail from "./AdminTourDetail";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import { useLocation } from "react-router-dom";

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const ManageTours = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Fetch tours on component mount
  useEffect(() => {
    fetchTours();
    fetchCategories();
  }, [location.pathname]);

  const fetchTours = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/tours");
      // Map backend 'isFeatured' to frontend 'featured'
      const mappedTours = response.data.result.map((tour) => ({
        ...tour,
        featured: tour.featured === true || tour.featured === "true",
      }));
      setTours(mappedTours);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tours:", error);
      toast.error("Không thể tải danh sách tour. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axiosInstance.get(`/tourTypes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setCategories(response.data.result || []);
      console.log(response.data.result);
    } catch (error) {
      // ignore
    }
  };

  const handleViewDetail = async (tour) => {
    try {
      const response = await axiosInstance.get(`/tours/${tour.tourId}`);
      setSelectedTour(response.data.result);
      setIsDetailOpen(true);
    } catch (error) {
      toast.error("Không thể tải chi tiết tour");
    }
  };

  const handleCloseDetail = () => {
    setSelectedTour(null);
    setIsDetailOpen(false);
  };

  const handleDelete = async (tourId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này?")) {
      try {
        await axiosInstance.delete(`/tours/${tourId}`);
        setTours(tours.filter((tour) => tour.tourId !== tourId));
        toast.success("Xóa tour thành công");
      } catch (error) {
        console.error("Error deleting tour:", error);
        toast.error("Không thể xóa tour. Vui lòng thử lại sau.");
      }
    }
  };

  const handleToggleStatus = async (tourId) => {
    try {
      const tour = tours.find((t) => t.tourId === tourId);
      const updatedTour = { ...tour, status: !(tour.status === true || tour.status === "true") };

      await axiosInstance.put(`/tours/${tourId}`, updatedTour);
      setTours(tours.map((t) => (t.tourId === tourId ? updatedTour : t)));
      toast.success("Trạng thái tour đã được cập nhật!");
    } catch (error) {
      console.error("Error updating tour status:", error);
      toast.error("Không thể cập nhật trạng thái tour. Vui lòng thử lại sau.");
    }
  };

  const handleToggleFeatured = async (tourId) => {
    try {
      const tour = tours.find((t) => t.tourId === tourId);
      // Toggle the featured status (using the internal 'featured' property)
      const updatedTour = { ...tour, featured: !(tour.featured === true || tour.featured === "true") };

      // Send the update to the backend using 'isFeatured'
      await axiosInstance.put(`/tours/${tourId}`, { ...updatedTour, featured: updatedTour.featured });

      setTours(tours.map((t) => (t.tourId === tourId ? updatedTour : t)));
      toast.success("Đã cập nhật trạng thái nổi bật của tour!");
    } catch (error) {
      console.error("Error updating tour featured status:", error);
      toast.error("Không thể cập nhật trạng thái nổi bật. Vui lòng thử lại sau.");
    }
  };

  // Filter tours based on search term
  const filteredTours = tours.filter((tour) => tour.name.toLowerCase().includes(searchTerm.toLowerCase()) || tour.location.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Tours</h1>
        <Button onClick={() => navigate("/admin/tours/add")} className="bg-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Thêm tour mới
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input type="text" placeholder="Tìm kiếm tour..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="whitespace-nowrap">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sắp xếp
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh tour</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên tour</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày khởi hành</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nổi bật</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTours.map((tour, idx) => (
                <tr key={tour.tourId} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetail(tour)}>
                  <td className="py-4 px-4 text-sm text-gray-900">{idx + 1}</td>
                  <td className="py-4 px-4 text-sm">{tour.coverImage && <img src={tour.coverImage} alt={tour.name} className="w-20 h-14 object-cover rounded" />}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{tour.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{tour.departureDate ? new Date(tour.departureDate).toLocaleDateString("vi-VN") : ""}</td>
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">{formatCurrency(tour.price)}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{tour.duration}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFeatured(tour.tourId);
                      }}
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tour.featured === true || tour.featured === "true" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {tour.featured === true || tour.featured === "true" ? "Có" : "Không"}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(tour.tourId);
                      }}
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tour.status === true || tour.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {tour.status === true || tour.status === "true" ? "Hoạt động" : "Dừng hoạt động"}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(tour)}>
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/tours/edit/${tour.tourId}`)}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(tour.tourId)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTours.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy tour nào phù hợp với từ khóa "{searchTerm}"</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Hiển thị {filteredTours.length} của {tours.length} tour
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

      {selectedTour && <AdminTourDetail tour={selectedTour} isOpen={isDetailOpen} onClose={handleCloseDetail} categories={categories} />}
    </div>
  );
};

export default ManageTours;
