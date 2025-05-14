import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Image, CalendarIcon, DollarSign, Users, MapPin, Clock, Star, CheckCircle, X, ImagePlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

const TourForm = ({ tour, isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    ten_tour: tour?.ten_tour || "",
    mo_ta: tour?.mo_ta || "",
    gia: tour?.gia || "",
    thoi_gian: tour?.thoi_gian || "",
    ngay_khoi_hanh: tour?.ngay_khoi_hanh ? new Date(tour.ngay_khoi_hanh) : new Date(),
    diem_khoi_hanh: tour?.diem_khoi_hanh || "",
    so_nguoi_toi_da: tour?.so_nguoi_toi_da || "",
    anh_dai_dien: tour?.anh_dai_dien || "",
    loai_tour_id: tour?.loai_tour_id || "",
    featured: tour?.featured || false,
    status: tour?.status || "active",
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tourImages, setTourImages] = useState([
    // Mock data cho ảnh tour
    { id: 1, url: "https://example.com/image1.jpg" },
    { id: 2, url: "https://example.com/image2.jpg" },
  ]);

  // Mock data cho loại tour
  const loaiTours = [
    { id: 1, ten_loai: "Tour Hà Nội" },
    { id: 2, ten_loai: "Tour Đà Nẵng" },
    { id: 3, ten_loai: "Tour nghỉ dưỡng" },
    { id: 4, ten_loai: "Tour mạo hiểm" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          anh_dai_dien: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.ten_tour || !formData.mo_ta || !formData.gia || !formData.thoi_gian || !formData.diem_khoi_hanh || !formData.so_nguoi_toi_da || !formData.loai_tour_id) {
      toast.error("Vui lòng điền đầy đủ thông tin tour");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(isEditing ? "Cập nhật tour thành công" : "Thêm mới tour thành công");
      navigate("/admin/tours");
    }, 500);
  };

  const handleCancel = () => {
    navigate("/admin/tours");
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) {
      setTourImages(tourImages.filter((img) => img.id !== imageId));
      toast.success("Đã xóa ảnh thành công!");
    }
  };

  const handleNavigateToImageForm = () => {
    navigate(`/admin/tours/${id}/images`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? "Chỉnh sửa tour" : "Thêm tour mới"}</h1>
      </div>

      <div className="bg-white rounded-lg p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Tên tour</label>
            <Input name="ten_tour" value={formData.ten_tour} onChange={handleChange} placeholder="Nhập tên tour" required className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mô tả</label>
            <Textarea name="mo_ta" value={formData.mo_ta} onChange={handleChange} placeholder="Nhập mô tả tour" required rows={3} className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                Giá tour
              </label>
              <div className="relative mt-1">
                <Input type="number" name="gia" value={formData.gia} onChange={handleChange} placeholder="Nhập giá tour" required className="pl-7" />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₫</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                Thời gian
              </label>
              <Input name="thoi_gian" value={formData.thoi_gian} onChange={handleChange} placeholder="VD: 3 ngày 2 đêm" required className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                Ngày khởi hành
              </label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !formData.ngay_khoi_hanh && "text-gray-500")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.ngay_khoi_hanh ? format(formData.ngay_khoi_hanh, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.ngay_khoi_hanh}
                    onSelect={(date) => {
                      setFormData((prev) => ({ ...prev, ngay_khoi_hanh: date }));
                      setIsCalendarOpen(false);
                    }}
                    locale={vi}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Điểm khởi hành
              </label>
              <Input name="diem_khoi_hanh" value={formData.diem_khoi_hanh} onChange={handleChange} placeholder="Nhập điểm khởi hành" required className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                Số người tối đa
              </label>
              <Input type="number" name="so_nguoi_toi_da" value={formData.so_nguoi_toi_da} onChange={handleChange} placeholder="Nhập số người" required min="1" className="mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Loại tour</label>
              <Select value={formData.loai_tour_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, loai_tour_id: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn loại tour" />
                </SelectTrigger>
                <SelectContent>
                  {loaiTours.map((loai) => (
                    <SelectItem key={loai.id} value={loai.id.toString()}>
                      {loai.ten_loai}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                Trạng thái
              </label>
              <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Dừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-500" />
                Nổi bật
              </label>
              <Select value={formData.featured.toString()} onValueChange={(value) => setFormData((prev) => ({ ...prev, featured: value === "true" }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Có</SelectItem>
                  <SelectItem value="false">Không</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Ảnh đại diện</label>
            <div className="mt-1 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="text-center">
                {formData.anh_dai_dien ? (
                  <div className="relative inline-block">
                    <img src={formData.anh_dai_dien} alt="Preview" className="h-32 rounded-lg object-cover" />
                    <button type="button" onClick={() => setFormData((prev) => ({ ...prev, anh_dai_dien: "" }))} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="file-upload" className="relative cursor-pointer">
                        <span className="rounded-md font-medium text-blue-600 hover:text-blue-500">Tải ảnh lên</span>
                        <input id="file-upload" name="file-upload" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                      </label>
                      <p className="pl-1 text-gray-500">hoặc kéo thả vào đây</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF tối đa 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {isEditing && tourImages.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Ảnh tour</label>
              <div className="grid grid-cols-4 gap-4">
                {tourImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img src={image.url} alt="Tour" className="w-full h-24 object-cover rounded-lg" />
                    <button type="button" onClick={() => handleDeleteImage(image.id)} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6">
            {isEditing && (
              <Button type="button" onClick={handleNavigateToImageForm} variant="outline" className="text-green-600 hover:text-green-800 hover:bg-green-50 border-green-200">
                <ImagePlus className="w-4 h-4 mr-2" />
                Quản lý ảnh tour
              </Button>
            )}
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourForm;
