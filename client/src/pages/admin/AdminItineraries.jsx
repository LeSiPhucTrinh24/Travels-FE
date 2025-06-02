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
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
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
      const itineraryResponse = await axiosInstance.get("/itineraries", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const tourResponse = await axiosInstance.get("/tours", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const destinationResponse = await axiosInstance.get("/destinations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setItineraries(itineraryResponse.data.result || []);
      setTours(tourResponse.data.result || []);
      setDestinations(destinationResponse.data.result || []);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      toast.error("Không thể tải danh sách lịch trình. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (itinerary) => {
    try {
      const response = await axiosInstance.get(`/itineraries/${itinerary.itineraryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setSelectedItinerary(response.data.result);
      console.log("handleViewDetail: ", response);
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
        setIsLoading(true);
        const response = await axiosInstance.delete(`/itineraries/${itineraryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data.result) {
          setItineraries((prevItineraries) => prevItineraries.filter((itin) => itin.itineraryId !== itineraryId));
          toast.success("Xóa lịch trình thành công");
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (error) {
        console.error("Error deleting itinerary:", error);
        const errorMessage = error.response?.data?.message || "Không thể xóa lịch trình. Vui lòng thử lại sau.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredItineraries = itineraries.filter((itinerary) => itinerary.dayTitle?.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <Input placeholder="Tìm kiếm lịch trình..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
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
            {filteredItineraries.map((itinerary) => {
              const destination = destinations.find((dest) => dest.destinationId === itinerary.destinationId);
              const destinationName = destination ? destination.destinationName : "Không xác định";

              const tour = tours.find((tour) => tour.tourId === itinerary.tourId);
              const tourName = tour ? tour.name : "Không xác định";
              return (
                <tr key={itinerary.itineraryId} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetail(itinerary)}>
                  <td className="py-4 px-4 text-sm text-gray-900">{tourName}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">Ngày {itinerary.dayNumber}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{itinerary.dayTitle}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{destinationName}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(itinerary)}>
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/itineraries/edit/${itinerary.itineraryId}`)}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(itinerary.itineraryId)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredItineraries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy lịch trình nào phù hợp với từ khóa "{searchTerm}"</p>
          </div>
        )}
      </div>

      {selectedItinerary && <AdminItineraryDetail itinerary={selectedItinerary} isOpen={isDetailOpen} onClose={handleCloseDetail} />}
    </div>
  );
};

export default ManageItineraries;
