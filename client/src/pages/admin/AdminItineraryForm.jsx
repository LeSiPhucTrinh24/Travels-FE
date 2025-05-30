import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tag, CheckCircle, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";

const AdminItineraryForm = () => {
  const navigate = useNavigate();
  const { itineraryId } = useParams();
  const isEditMode = Boolean(itineraryId);

  const [formData, setFormData] = useState({
    tourId: "",
    dayTitle: "",
    dayNumber: "",
    description: "",
    destinationId: "",
  });

  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTours();
    fetchDestinations();
  }, []);

  const fetchTours = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axiosInstance.get(`/tours`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const tourList = response.data.result || [];
      setTours(tourList);
      if (!isEditMode && tourList.length > 0) {
        setFormData((prev) => ({ ...prev, tourId: tourList[0].tourId }));
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axiosInstance.get(`/destinations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const destList = response.data.result || [];
      setDestinations(destList);
      if (!isEditMode && destList.length > 0) {
        setFormData((prev) => ({ ...prev, destinationId: destList[0].destinationId }));
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchItineraryDetails();
    }
  }, [itineraryId]);

  const fetchItineraryDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/itineraries/${itineraryId}`);
      const itinerary = response.data.result;
      setFormData({
        tourId: itinerary.tourId || "",
        dayTitle: itinerary.dayTitle || "",
        dayNumber: itinerary.dayNumber?.toString() || "",
        description: itinerary.description || "",
        destinationId: itinerary.destinationId || "",
      });
    } catch (error) {
      console.error("Error fetching itinerary details:", error);
      toast.error("Không thể tải thông tin hành trình. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dataToSend = {
        tourId: formData.tourId,
        dayTitle: formData.dayTitle,
        dayNumber: formData.dayNumber ? Number(formData.dayNumber) : null,
        description: formData.description,
        destinationId: formData.destinationId,
      };

      console.log("Data gửi lên:", dataToSend);

      if (isEditMode) {
        await axiosInstance.put(`/itineraries/${itineraryId}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Cập nhật hành trình thành công!");
      } else {
        await axiosInstance.post("/itineraries", dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Thêm hành trình mới thành công!");
      }
      navigate("/admin/itineraries");
    } catch (error) {
      console.error("Error saving itinerary:", error, error.response?.data);
      toast.error(error.response?.data?.message || JSON.stringify(error.response?.data) || (isEditMode ? "Không thể cập nhật hành trình" : "Không thể thêm hành trình mới"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditMode ? "Chỉnh sửa hành trình" : "Thêm hành trình mới"}</h1>
      </div>
      <div className="bg-white rounded-lg p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              Tour
            </label>
            <Select value={formData.tourId} onValueChange={(value) => setFormData((prev) => ({ ...prev, tourId: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn tour" />
              </SelectTrigger>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour.tourId} value={tour.tourId}>
                    {tour.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tiêu đề ngày</label>
            <Input
              name="dayTitle"
              value={formData.dayTitle}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề ngày (ví dụ: Ngày 1 - Khám phá thành phố)"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gray-500" />
              Số ngày
            </label>
            <Input
              type="number"
              name="dayNumber"
              value={formData.dayNumber}
              onChange={handleInputChange}
              placeholder="Nhập số ngày (ví dụ: 1)"
              required
              min="1"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Mô tả</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả hành trình"
              required
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              Điểm đến
            </label>
            <Select value={formData.destinationId} onValueChange={(value) => setFormData((prev) => ({ ...prev, destinationId: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn điểm đến" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((dest) => (
                  <SelectItem key={dest.destinationId} value={dest.destinationId}>
                    {dest.destinationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/itineraries")} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" className="bg-primary text-white" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : isEditMode ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminItineraryForm;