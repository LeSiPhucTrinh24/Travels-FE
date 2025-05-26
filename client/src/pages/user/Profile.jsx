import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Key, MapPin, Calendar, Image } from "lucide-react";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthdate: "",
    avatar: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        setIsLoading(true);
        const response = await axiosInstance.get("/users/myInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const data = response.data.result;
        setProfileData(data);
        setProfileForm({
          name: data.fullName || "",
          email: data.userName || "",
          phone: data.phone || "",
          address: data.address || "",
          birthdate: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : "",
          avatar: data.avatar || "",
        });
        setPreviewUrl(data.avatar || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin cá nhân. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileForm.name.trim()) {
      newErrors.name = "Tên không được để trống";
    }

    if (profileForm.phone && !/^[0-9]{10}$/.test(profileForm.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (profileForm.birthdate) {
      const birthDate = new Date(profileForm.birthdate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthdate = "Ngày sinh không thể lớn hơn ngày hiện tại";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
      });
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)",
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const dobValue = profileForm.birthdate ? profileForm.birthdate : "";
      const formData = new FormData();
      formData.append("fullName", profileForm.name);
      formData.append("phone", profileForm.phone);
      formData.append("address", profileForm.address);
      formData.append("dob", dobValue);

      if (selectedFile) {
        formData.append("file", selectedFile);
      } else if (profileForm.avatar) {
        formData.append("avatar", profileForm.avatar);
      }

      await axiosInstance.put(`/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân của bạn đã được cập nhật",
      });

      setIsEditing(false);
      setSelectedFile(null);

      // Reload profile data
      const response = await axiosInstance.get("/users/myInfo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data.result;
      setProfileData(data);
      setProfileForm({
        name: data.fullName || "",
        email: data.userName || "",
        phone: data.phone || "",
        address: data.address || "",
        birthdate: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : "",
        avatar: data.avatar || "",
      });
      setPreviewUrl(data.avatar || null);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message || "Không thể cập nhật thông tin. Vui lòng thử lại sau.";
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast({
        title: "Mật khẩu mới không được trùng với mật khẩu cũ!",
        description: "Mật khẩu mới và mật khẩu cũ trùng nhau",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      await axiosInstance.put(
        `/auth/change/${userId}`,
        {
          oldPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      toast({
        title: "Cập nhật thành công",
        description: "Mật khẩu của bạn đã được thay đổi",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage = error.response?.data?.message || "Không thể thay đổi mật khẩu. Vui lòng thử lại sau.";
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profileData) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary mb-4">
                <img src={previewUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || "User")}`} alt={profileForm.name || "User"} className="w-full h-full object-cover" />
              </div>
              {isEditing && (
                <Button size="icon" variant="outline" className="absolute bottom-3 right-0 rounded-full h-8 w-8 bg-white" onClick={() => fileInputRef.current?.click()} type="button" disabled={isLoading}>
                  <Image className="h-4 w-4" />
                </Button>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} disabled={!isEditing || isLoading} />
            </div>
            <h2 className="text-xl font-bold">{profileForm.name || "Chưa đặt tên"}</h2>
            <p className="text-gray-500">{profileForm.email}</p>
            <p className="text-sm text-gray-400 mt-1">Thành viên từ: {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString("vi-VN") : "N/A"}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span>{profileForm.name || "Chưa đặt tên"}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span>{profileForm.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span>{profileForm.phone || "Chưa cập nhật"}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{profileForm.address || "Chưa cập nhật"}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{profileForm.birthdate ? new Date(profileForm.birthdate).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <Input name="name" value={profileForm.name} onChange={handleProfileChange} disabled={!isEditing || isLoading} />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input name="email" type="email" value={profileForm.email} disabled className="bg-gray-100" />
                  <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi sau khi đăng ký</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <Input name="phone" value={profileForm.phone} onChange={handleProfileChange} disabled={!isEditing || isLoading} />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <Input name="address" value={profileForm.address} onChange={handleProfileChange} disabled={!isEditing || isLoading} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <Input name="birthdate" type="date" value={profileForm.birthdate} onChange={handleProfileChange} disabled={!isEditing || isLoading} />
                  {errors.birthdate && <p className="text-sm text-red-500 mt-1">{errors.birthdate}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                  {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)} disabled={isLoading}>
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedFile(null);
                          setPreviewUrl(profileData?.avatar || null);
                          setProfileForm({
                            name: profileData.fullName || "",
                            email: profileData.userName || "",
                            phone: profileData.phone || "",
                            address: profileData.address || "",
                            birthdate: profileData.dob ? new Date(profileData.dob).toISOString().slice(0, 10) : "",
                            avatar: profileData.avatar || "",
                          });
                        }}
                        disabled={isLoading}
                      >
                        Hủy
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="currentPassword" name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordChange} disabled={isLoading} placeholder="Nhập mật khẩu hiện tại" required />
                    </div>
                    {errors.currentPassword && <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="newPassword" name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} disabled={isLoading} placeholder="Nhập mật khẩu mới" required minLength={6} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                    {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} disabled={isLoading} placeholder="Nhập lại mật khẩu mới" required minLength={6} />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
