import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

const UserForm = ({ user, isEditing = false }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dob: user?.dob || "",
    image: user?.avatar || user?.image || "",
    userName: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && userId) {
      axiosInstance
        .get(`/users/${userId}`)
        .then((res) => {
          const user = res.data.result;
          console.log("User data from API (GET):", user);
          setFormData({
            name: user.fullName || user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
            image: user.avatar || "",
          });
        })
        .catch(() => toast.error("Không thể tải thông tin người dùng"));
    }
  }, [isEditing, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Họ tên không được để trống.";
    }

    if (!isEditing) {
      if (!formData.userName) {
        errors.userName = "Email không được để trống.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userName)) {
        errors.userName = "Email không đúng định dạng.";
      }
      if (!formData.password) {
        errors.password = "Mật khẩu không được để trống.";
      } else if (formData.password.length < 6) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      }
    }

    if (!formData.phone) {
      errors.phone = "Số điện thoại không được để trống.";
    }

    if (!formData.address) {
      errors.address = "Địa chỉ không được để trống.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return; // Stop submission if there are errors
    }

    const form = new FormData();
    form.append("fullName", formData.name);
    form.append("phone", formData.phone);
    form.append("address", formData.address);
    if (formData.dob) {
      form.append("dob", formData.dob);
    }

    // Only append file if it's a new File object (new image selected)
    if (formData.image instanceof File) {
      form.append("file", formData.image);
    } else if (isEditing && formData.image) {
      // If editing and image is a string (URL), append it as avatar
      form.append("avatar", formData.image);
    }

    if (!isEditing) {
      form.append("userName", formData.userName);
      form.append("password", formData.password);
    }

    for (let pair of form.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try {
      if (isEditing && userId) {
        await axiosInstance.put(`/users/${userId}`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Cập nhật người dùng thành công!");
        // Navigate to user list page after successful update
        navigate("/admin/users");
      } else {
        await axiosInstance.post("/users", form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Thêm người dùng thành công!");
        navigate("/admin/users");
      }
    } catch (err) {
      console.error("API error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        // Handle backend validation errors
        if (err.response.status === 400) {
          toast.error(`Lỗi validation: ${err.response.data.message}`);
          // You might need to parse err.response.data.errors if backend sends specific field errors
        } else {
          toast.error(`Lỗi: ${err.response.data.message}`);
        }
      } else {
        toast.error("Thao tác thất bại! Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
                <img src={typeof formData.image === "string" ? formData.image : URL.createObjectURL(formData.image)} alt="Preview" className="h-full w-full object-cover" />
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
                        setFormData((prev) => ({ ...prev, image: file }));
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
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nhập họ tên" required disabled={isSubmitting} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {!isEditing && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Email (Tên đăng nhập)</label>
              <Input name="userName" type="email" value={formData.userName} onChange={handleChange} placeholder="Nhập email" required disabled={isSubmitting} />
              {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Mật khẩu</label>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Nhập mật khẩu" required minLength={6} disabled={isSubmitting} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Số điện thoại</label>
          <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Nhập số điện thoại" required disabled={isSubmitting} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Địa chỉ</label>
          <Input name="address" value={formData.address} onChange={handleChange} placeholder="Nhập địa chỉ" required disabled={isSubmitting} />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Ngày sinh</label>
          <Input type="date" name="dob" value={formData.dob} onChange={handleChange} placeholder="yyyy-MM-dd" disabled={isSubmitting} />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? "Đang cập nhật..." : "Đang thêm...") : isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
