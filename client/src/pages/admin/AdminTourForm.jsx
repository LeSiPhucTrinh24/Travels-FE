import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format as formatDate } from "date-fns";
import { vi } from "date-fns/locale";
import { Image, CalendarIcon, DollarSign, Users, MapPin, Clock, Star, CheckCircle, X, Tag, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";

const AdminTourForm = () => {
  const navigate = useNavigate();
  const { tourId } = useParams();
  const isEditMode = Boolean(tourId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    departureDate: new Date(),
    departureLocation: "",
    maxPeople: "",
    coverImage: "",
    tourTypeId: "",
    status: true,
    featured: false,
  });

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tourImages, setTourImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      const cats = response.data.result || [];
      setCategories(cats);
      if (!isEditMode && cats.length > 0) {
        setFormData((prev) => ({ ...prev, tourTypeId: cats[0].tourTypeId }));
      }
    } catch (error) {
      // Không toast ở đây để tránh gây phiền khi vào form
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchTourDetails();
      fetchTourImages();
    }
  }, [tourId]);

  const fetchTourDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/tours/${tourId}`);
      const tour = response.data.result;
      setFormData({
        name: tour.name || "",
        description: tour.description || "",
        price: tour.price?.toString() || "",
        duration: tour.duration?.toString() || "",
        departureDate: tour.departureDate ? new Date(tour.departureDate) : new Date(),
        departureLocation: tour.departureLocation || "",
        maxPeople: tour.maxPeople?.toString() || "",
        coverImage: tour.coverImage || "",
        tourTypeId: tour.tourTypeId || "",
        status: tour.status ?? true,
        featured: tour.featured === true || tour.featured === "true",
      });
      if (tour.coverImage) {
        setPreviewUrl(tour.coverImage);
      }
    } catch (error) {
      console.error("Error fetching tour details:", error);
      toast.error("Không thể tải thông tin tour. Vui lòng thử lại sau.");
      navigate("/admin/tours");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTourImages = async () => {
    try {
      setIsLoadingImages(true);
      const response = await axiosInstance.get(`/tours/${tourId}/images`);
      setTourImages(response.data.result || []);
    } catch (error) {
      console.error("Error fetching tour images:", error);
      toast.error("Không thể tải ảnh tour. Vui lòng thử lại sau.");
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(`/tours/${tourId}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTourImages((prev) => [...prev, response.data.result]);
      toast.success("Thêm ảnh thành công!");
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("Không thể thêm ảnh. Vui lòng thử lại sau.");
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axiosInstance.delete(`/tours/${tourId}/images/${imageId}`);
      setTourImages((prev) => prev.filter((img) => img.imageId !== imageId));
      toast.success("Xóa ảnh thành công!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Không thể xóa ảnh. Vui lòng thử lại sau.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price ? String(formData.price) : "");
      formDataToSend.append("duration", formData.duration ? String(formData.duration) : "");
      formDataToSend.append("departureDate", formData.departureDate instanceof Date ? formatDate(formData.departureDate, "yyyy-MM-dd") : formData.departureDate);
      formDataToSend.append("departureLocation", formData.departureLocation);
      formDataToSend.append("maxPeople", formData.maxPeople ? String(formData.maxPeople) : "");
      formDataToSend.append("tourTypeId", formData.tourTypeId);
      formDataToSend.append("status", formData.status === true || formData.status === "true" ? "true" : "false");
      formDataToSend.append("featured", formData.featured === true || formData.featured === "true" ? "true" : "false");
      if (image) {
        formDataToSend.append("file", image);
      } else if (formData.coverImage) {
        formDataToSend.append("coverImage", formData.coverImage);
      }
      // Log giá trị coverImage để kiểm tra
      console.log("coverImage gửi lên:", formData.coverImage);
      // Log toàn bộ FormData để debug
      console.log("FormData gửi lên:", [...formDataToSend.entries()]);
      if (isEditMode) {
        await axiosInstance.put(`/tours/${tourId}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Cập nhật tour thành công!");
      } else {
        await axiosInstance.post("/tours", formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Thêm tour mới thành công!");
      }
      navigate("/admin/tours");
    } catch (error) {
      console.error("Error saving tour:", error, error.response?.data);
      toast.error(error.response?.data?.message || JSON.stringify(error.response?.data) || (isEditMode ? "Không thể cập nhật tour" : "Không thể thêm tour mới"));
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
        <h1 className="text-2xl font-bold">{isEditMode ? "Chỉnh sửa tour" : "Thêm tour mới"}</h1>
      </div>
      <div className="bg-white rounded-lg p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Tên tour</label>
            <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Nhập tên tour" required className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Mô tả</label>
            <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Nhập mô tả tour" required rows={3} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                Giá tour
              </label>
              <Input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Nhập giá tour" required min="0" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                Thời lượng (ngày)
              </label>
              <Input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Nhập số ngày" required min="1" className="mt-1" />
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
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !formData.departureDate && "text-gray-500")}>
                    {" "}
                    <CalendarIcon className="mr-2 h-4 w-4" /> {formData.departureDate ? formatDate(formData.departureDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}{" "}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.departureDate}
                    onSelect={(date) => {
                      setFormData((prev) => ({ ...prev, departureDate: date }));
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
              <Input name="departureLocation" value={formData.departureLocation} onChange={handleInputChange} placeholder="Nhập điểm khởi hành" required className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                Số người tối đa
              </label>
              <Input type="number" name="maxPeople" value={formData.maxPeople} onChange={handleInputChange} placeholder="Nhập số người" required min="1" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                Loại tour
              </label>
              <Select value={formData.tourTypeId} onValueChange={(value) => setFormData((prev) => ({ ...prev, tourTypeId: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn loại tour" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.tourTypeId} value={cat.tourTypeId}>
                      {cat.tourTypeName}
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
              <Select value={formData.status ? "true" : "false"} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value === "true" }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Hoạt động</SelectItem>
                  <SelectItem value="false">Dừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-500" />
                Nổi bật
              </label>
              <Select value={formData.featured ? "true" : "false"} onValueChange={(value) => setFormData((prev) => ({ ...prev, featured: value === "true" }))}>
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
            <div className="mt-1 flex">
              <div className="w-full max-w-xs bg-gray-50 border-2 border-gray-300 rounded-xl shadow-sm flex flex-col items-center py-6 px-4 transition-all duration-200 hover:border-primary group">
                {previewUrl ? (
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl border border-gray-200 shadow" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl("");
                        setImage(null);
                      }}
                      className="absolute -top-3 -right-3 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200 z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center h-48 w-48 border-2 border-dashed border-gray-300 rounded-xl bg-white group-hover:border-primary transition-all duration-200">
                      <Image className="h-12 w-12 text-gray-400 mb-2" />
                      <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium">
                        Tải ảnh lên
                        <input id="file-upload" name="file-upload" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">hoặc kéo thả vào đây</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">PNG, JPG, GIF tối đa 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/tours")} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" className="bg-primary text-white" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : isEditMode ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </div>

      {isEditMode && (
        <div className="mt-8 bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Quản lý ảnh tour</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tourImages.map((image) => (
              <div key={image.imageId} className="relative group">
                <img src={image.url} alt="Tour" className="w-full h-48 object-cover rounded-lg" />
                <button
                  onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này không?")) {
                      handleDeleteImage(image.imageId);
                    }
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <label className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Thêm ảnh</span>
              <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
            </label>
          </div>

          {isLoadingImages && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTourForm;
