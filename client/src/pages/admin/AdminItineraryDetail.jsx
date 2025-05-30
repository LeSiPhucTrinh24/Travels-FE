import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tag, CheckCircle, FileText, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

const AdminItineraryDetail = ({ itinerary, isOpen, onClose }) => {
  const [tour, setTour] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!itinerary || !itinerary.tourId || !itinerary.destinationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [tourResponse, destinationResponse] = await Promise.all([
          axiosInstance.get(`/tours/${itinerary.tourId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }),
          axiosInstance.get(`/destinations/${itinerary.destinationId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        setTour(tourResponse.data.result || null);
        setDestination(destinationResponse.data.result || null);
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Không thể tải thông tin tour hoặc điểm đến.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [itinerary]);

  if (!itinerary) return null;

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Chi tiết lịch trình</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chi tiết lịch trình</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{itinerary.dayTitle}</h3>
            <p className="text-gray-500">
              Thuộc tour: {tour ? tour.name : "Không xác định"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Ngày thứ
              </p>
              <p className="font-medium">Ngày {itinerary.dayNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Điểm đến
              </p>
              <p className="font-medium">
                {destination ? destination.destinationName : "Không xác định"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Mô tả chi tiết
            </p>
            <p className="mt-1">{itinerary.description}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminItineraryDetail;