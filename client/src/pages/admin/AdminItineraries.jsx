import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import AdminItineraryDetail from "./AdminItineraryDetail"; // Import file chi tiết mới

const ManageItineraries = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  // Fetch itineraries on component mount
  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/itineraries");
      setItineraries(response.data.result || []);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      toast.error("Không thể tải danh sách lịch trình. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (itinerary) => {
    try {
      const response = await axiosInstance.get(`/itineraries/${itinerary.id}`);
      setSelectedItinerary(response.data.result);
      setIsDetailOpen(true);
    } catch (error) {
      toast.error("Không thể tải chi tiết lịch trình");
    }
  };

  const handleCloseDetail = () => {
    setSelectedItinerary(null);
    setIsDetailOpen(false);
  };

  const handleDelete = async (itineraryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) {
      try {
        await axiosInstance.delete(`/itineraries/${itineraryId}`);
        setItineraries(itineraries.filter((itin) => itin.id !== itineraryId));
        toast.success("Xóa lịch trình thành công");
      } catch (error) {
        console.error("Error deleting itinerary:", error);
        toast.error("Không thể xóa lịch trình. Vui lòng thử lại sau.");
      }
    }
  };

  const filteredItineraries = itineraries.filter((itinerary) =>
    itinerary.tour_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    itinerary.tieu_de_ngay?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold">Quản lý lịch trình</h1>
        <Button onClick={() => navigate("/admin/itineraries/add")} className="bg-primary text-white">
          <Plus className="h-4 w-4 mr-2" />
          Thêm lịch trình
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Tìm kiếm lịch trình..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thứ</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm đến</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItineraries.map((itinerary) => (
              <tr key={itinerary.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetail(itinerary)}>
                <td className="py-4 px-4 text-sm text-gray-900">{itinerary.tour_name}</td>
                <td className="py-4 px-4 text-sm text-gray-900">Ngày {itinerary.ngay_thu}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{itinerary.tieu_de_ngay}</td>
                <td className="py-4 px-4 text-sm text-gray-500">{itinerary.diem_den}</td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(itinerary)}>
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => navigate(`/admin/itineraries/edit/${itinerary.id}`)}
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(itinerary.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredItineraries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy lịch trình nào phù hợp với từ khóa "{searchTerm}"</p>
          </div>
        )}
      </div>

      {selectedItinerary && (
        <AdminItineraryDetail
          itinerary={selectedItinerary}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default ManageItineraries;