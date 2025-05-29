import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tag, CheckCircle, FileText, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminItineraryDetail = ({ itinerary, isOpen, onClose }) => {
  if (!itinerary) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chi tiết lịch trình</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{itinerary.tieu_de_ngay}</h3>
            <p className="text-gray-500">Thuộc tour: {itinerary.tour_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Ngày thứ
              </p>
              <p className="font-medium">Ngày {itinerary.ngay_thu}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Điểm đến
              </p>
              <p className="font-medium">{itinerary.diem_den}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Mô tả chi tiết
            </p>
            <p className="mt-1">{itinerary.mo_ta_chi_tiet}</p>
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