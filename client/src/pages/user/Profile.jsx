import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Key, MapPin, Calendar, Image } from "lucide-react";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "77 Nguyễn Huệ, Thành Phố Huế",
    birthdate: "1990-01-01",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    setTimeout(() => {
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân của bạn đã được cập nhật",
      });
      setIsEditing(false);
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Mật khẩu không khớp",
        description: "Mật khẩu mới và xác nhận mật khẩu không khớp nhau",
        variant: "destructive",
      });
      return;
    }

    setTimeout(() => {
      toast({
        title: "Cập nhật thành công",
        description: "Mật khẩu của bạn đã được thay đổi",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary mb-4">
                <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=random"} alt={user?.name || "User"} className="w-full h-full object-cover" />
              </div>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-3 right-0 rounded-full h-8 w-8 bg-white"
                onClick={() => {
                  toast({
                    title: "Tính năng đang phát triển",
                    description: "Chức năng đổi ảnh đại diện sẽ sớm được cập nhật",
                  });
                }}
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold">{user?.name || "Chưa đặt tên"}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-400 mt-1">Thành viên từ: 05/2023</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span>{user?.name || "Chưa đặt tên"}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span>{user?.email}</span>
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
          <Tabs defaultValue="account">
            <TabsList className="mb-6">
              <TabsTrigger value="account">Thông tin tài khoản</TabsTrigger>
              <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} disabled={!isEditing} placeholder="Nhập họ và tên của bạn" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="email" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} disabled={true} placeholder="Nhập email của bạn" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi sau khi đăng ký</p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="phone" name="phone" value={profileForm.phone} onChange={handleProfileChange} disabled={!isEditing} placeholder="Nhập số điện thoại của bạn" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="address" name="address" value={profileForm.address} onChange={handleProfileChange} disabled={!isEditing} placeholder="Nhập địa chỉ của bạn" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="birthdate" name="birthdate" type="date" value={profileForm.birthdate} onChange={handleProfileChange} disabled={!isEditing} />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    {isEditing ? (
                      <>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
                          Hủy
                        </Button>
                        <Button type="submit">Lưu thay đổi</Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        Chỉnh sửa thông tin
                      </Button>
                    )}
                  </div>
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
                      <Input id="currentPassword" name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="Nhập mật khẩu hiện tại" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="newPassword" name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="Nhập mật khẩu mới" required minLength={6} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2 text-gray-400" />
                      <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} placeholder="Nhập lại mật khẩu mới" required minLength={6} />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit">Đổi mật khẩu</Button>
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
