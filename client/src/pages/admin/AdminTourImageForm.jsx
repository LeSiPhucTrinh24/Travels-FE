import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Image, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const TourImageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [images, setImages] = useState([
    // Mock data
    { id: 1, url: "https://example.com/image1.jpg" },
    { id: 2, url: "https://example.com/image2.jpg" },
  ]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now(),
            url: reader.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    toast.success("Đã tải ảnh lên thành công!");
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) {
      setImages(images.filter((img) => img.id !== imageId));
      toast.success("Đã xóa ảnh thành công!");
    }
  };

  const handleBack = () => {
    navigate(`/admin/tours/edit/${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Quản lý ảnh tour</h1>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <div className="flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-200 cursor-pointer">
            <div className="text-center">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="relative cursor-pointer">
                  <span className="rounded-md font-medium text-blue-600 hover:text-blue-500">Tải ảnh lên</span>
                  <input id="file-upload" name="file-upload" type="file" accept="image/*" multiple onChange={handleImageUpload} className="sr-only" />
                </label>
                <p className="pl-1 text-gray-500">hoặc kéo thả vào đây</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF tối đa 10MB</p>
            </div>
          </div>
        </div>

        {images.length > 0 ? (
          <div>
            <h2 className="text-lg font-medium mb-4">Danh sách ảnh</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img src={image.url} alt="Tour" className="w-full aspect-video object-cover rounded-lg" />
                  <button type="button" onClick={() => handleDeleteImage(image.id)} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Chưa có ảnh nào được tải lên</div>
        )}
      </div>
    </div>
  );
};

export default TourImageForm;
