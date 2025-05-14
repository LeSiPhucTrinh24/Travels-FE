import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Eye, Filter, ArrowUpDown } from "lucide-react";
import AdminTourDetail from "./AdminTourDetail";
import { toast } from "react-toastify";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  // Mock tours data
  const [tours, setTours] = useState([
    { id: 1, name: "Vịnh Hạ Long 2 ngày 1 đêm", location: "Hạ Long", price: 1790000, duration: "2 ngày 1 đêm", featured: true, status: "active" },
    { id: 2, name: "Đà Nẵng - Hội An 3 ngày 2 đêm", location: "Đà Nẵng", price: 2590000, duration: "3 ngày 2 đêm", featured: true, status: "active" },
    { id: 3, name: "Phú Quốc 4 ngày 3 đêm", location: "Phú Quốc", price: 3490000, duration: "4 ngày 3 đêm", featured: false, status: "active" },
    { id: 4, name: "Đà Lạt 3 ngày 2 đêm", location: "Đà Lạt", price: 2190000, duration: "3 ngày 2 đêm", featured: true, status: "active" },
    { id: 5, name: "Sapa 2 ngày 1 đêm", location: "Sapa", price: 1490000, duration: "2 ngày 1 đêm", featured: false, status: "inactive" },
    { id: 6, name: "Nha Trang 3 ngày 2 đêm", location: "Nha Trang", price: 2290000, duration: "3 ngày 2 đêm", featured: false, status: "active" },
    { id: 7, name: "Huế - Đà Nẵng - Hội An 4 ngày 3 đêm", location: "Huế", price: 3190000, duration: "4 ngày 3 đêm", featured: false, status: "active" },
  ]);

  const handleViewDetail = (tour) => {
    setSelectedTour(tour);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedTour(null);
    setIsDetailOpen(false);
  };

  const handleDelete = (tourId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này?")) {
      setTours(tours.filter((tour) => tour.id !== tourId));
      toast.success("Xóa tour thành công");
    }
  };

  const handleToggleStatus = (tourId) => {
    setTours(tours.map((tour) => (tour.id === tourId ? { ...tour, status: tour.status === "active" ? "inactive" : "active" } : tour)));
    toast.success("Trạng thái tour đã được cập nhật!");
  };

  const handleToggleFeatured = (tourId) => {
    setTours(tours.map((tour) => (tour.id === tourId ? { ...tour, featured: !tour.featured } : tour)));
    toast.success("Đã cập nhật trạng thái nổi bật của tour!");
  };

  // Filter tours based on search term
  const filteredTours = tours.filter((tour) => tour.name.toLowerCase().includes(searchTerm.toLowerCase()) || tour.location.toLowerCase().includes(searchTerm.toLowerCase()));

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
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên tour</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nổi bật</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetail(tour)}>
                  <td className="py-4 px-4 text-sm text-gray-900">{tour.id}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{tour.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{tour.location}</td>
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">{formatCurrency(tour.price)}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{tour.duration}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFeatured(tour.id);
                      }}
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tour.featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {tour.featured ? "Có" : "Không"}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(tour.id);
                      }}
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tour.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {tour.status === "active" ? "Hoạt động" : "Dừng hoạt động"}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(tour)}>
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(tour.id)}>
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

      {selectedTour && <AdminTourDetail tour={selectedTour} isOpen={isDetailOpen} onClose={handleCloseDetail} />}
    </div>
  );
};

export default ManageTours;
