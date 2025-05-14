import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { DollarSign, Users, MapPin, Clock, Star, CheckCircle, Calendar, Image as ImageIcon, FileText, Tag, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const TourDetail = ({ isOpen, onClose, tour }) => {
  if (!tour) return null;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Chi tiết tour</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            {/* Thông tin cơ bản */}
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{tour.name}</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-lg">{tour.location}</span>
              </div>
            </div>

            {/* Grid thông tin chính */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-medium">Giá tour</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(tour.price)}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="font-medium">Thời gian</span>
                </div>
                <p className="mt-2 text-xl text-gray-900">{tour.duration}</p>
              </div>
            </div>

            {/* Grid trạng thái */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Star className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="font-medium">Nổi bật</span>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${tour.featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>{tour.featured ? "Có" : "Không"}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="font-medium">Trạng thái</span>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${tour.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{tour.status === "active" ? "Hoạt động" : "Dừng hoạt động"}</span>
                </div>
              </div>
            </div>

            {/* Grid thông tin bổ sung */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Users className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span className="font-medium">Số người tối đa</span>
                </div>
                <p className="mt-2 text-lg text-gray-900">{tour.so_nguoi_toi_da || "Không giới hạn"}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-rose-500" />
                  </div>
                  <span className="font-medium">Ngày khởi hành</span>
                </div>
                <p className="mt-2 text-lg text-gray-900">{tour.ngay_khoi_hanh || "Chưa cập nhật"}</p>
              </div>
            </div>

            {/* Mô tả tour */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-600 mb-4">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <FileText className="w-5 h-5 text-teal-500" />
                </div>
                <span className="font-medium">Mô tả tour</span>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{tour.description || "Chưa có mô tả"}</p>
              </div>
            </div>

            {/* Danh sách hình ảnh */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-600 mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-orange-500" />
                </div>
                <span className="font-medium">Hình ảnh tour</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {tour.images && tour.images.length > 0 ? (
                  tour.images.map((image, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-lg">
                      <img src={image} alt={`Tour ${index + 1}`} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-3">Chưa có hình ảnh</p>
                )}
              </div>
            </div>

            {/* Lịch trình */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-600 mb-4">
                <div className="p-2 bg-cyan-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-cyan-500" />
                </div>
                <span className="font-medium">Lịch trình tour</span>
              </div>
              {tour.itinerary ? (
                <div className="space-y-6">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-blue-200">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ngày {index + 1}</h4>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Chưa có lịch trình</p>
              )}
            </div>

            {/* Danh mục */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-600 mb-4">
                <div className="p-2 bg-pink-50 rounded-lg">
                  <Tag className="w-5 h-5 text-pink-500" />
                </div>
                <span className="font-medium">Danh mục</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tour.categories && tour.categories.length > 0 ? (
                  tour.categories.map((category, index) => (
                    <span key={index} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                      {category}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có danh mục</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TourDetail;
