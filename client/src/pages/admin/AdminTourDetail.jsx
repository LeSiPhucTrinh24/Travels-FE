import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { DollarSign, Users, MapPin, Clock, Star, CheckCircle, Calendar, Image as ImageIcon, FileText, Tag, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const AdminTourDetail = ({ tour, isOpen, onClose, categories = [] }) => {
  if (!tour) return null;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper to get tour type name
  const getTourTypeName = () => {
    if (tour.tourTypeName) return tour.tourTypeName;
    if (categories.length > 0 && tour.tourTypeId) {
      const found = categories.find((cat) => cat.tourTypeId === tour.tourTypeId);
      return found ? found.tourTypeName : tour.tourTypeId;
    }
    return tour.tourTypeId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chi tiết tour</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>{tour.coverImage && <img src={tour.coverImage} alt={tour.name} className="w-full h-64 object-cover rounded-lg" />}</div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{tour.name}</h3>
              <p className="text-gray-500">{tour.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Giá tour</p>
                <p className="font-medium">{formatCurrency(tour.price)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium">{tour.duration} ngày</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Điểm khởi hành</p>
                <p className="font-medium">{tour.departureLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số người tối đa</p>
                <p className="font-medium">{tour.maxPeople}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loại tour</p>
                <p className="font-medium">{getTourTypeName()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Mô tả</p>
              <p className="mt-1">{tour.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tour.status === true || tour.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{tour.status === true || tour.status === "active" ? "Hoạt động" : "Dừng hoạt động"}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tour nổi bật</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tour.isFeatured || tour.featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>{tour.isFeatured || tour.featured ? "Có" : "Không"}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTourDetail;
