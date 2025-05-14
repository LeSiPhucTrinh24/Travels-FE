import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const UserForm = ({ user, isEditing = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    role: user?.isAdmin ? "admin" : "customer",
    status: user?.status || "active",
    image: user?.image || "",
    address: user?.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log("Form submitted:", formData);
    navigate("/admin/users");
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Hình ảnh</label>
          <div className="flex items-center space-x-4">
            <div className="h-32 w-32 rounded-lg overflow-hidden bg-gray-100">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <span className="text-4xl">{formData.name ? formData.name.charAt(0).toUpperCase() : "+"}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="user-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Bấm để tải ảnh lên</span> hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (Tối đa 2MB)</p>
                  </div>
                  <Input
                    id="user-image"
                    type="file"
                    name="image"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert("Kích thước file không được vượt quá 2MB");
                          e.target.value = "";
                          return;
                        }
                        const imageUrl = URL.createObjectURL(file);
                        setFormData((prev) => ({ ...prev, image: imageUrl }));
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Họ tên</label>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nhập họ tên" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Email</label>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Nhập email" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Số điện thoại</label>
          <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Nhập số điện thoại" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Địa chỉ</label>
          <Input name="address" value={formData.address} onChange={handleChange} placeholder="Nhập địa chỉ" required />
        </div>

        {!isEditing && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Mật khẩu</label>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nhập mật khẩu" required={!isEditing} />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Vai trò</label>
          <Select value={formData.role} onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="customer">Khách hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Trạng thái</label>
          <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Vô hiệu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
