import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Save,
  Mail,
  Bell,
  Lock,
  User,
  Globe,
  Palette,
  CreditCard,
  Building,
  FileText,
  Check
} from 'lucide-react';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Handle save changes
  const handleSaveChanges = (e) => {
    e.preventDefault();
    
    // Show saved message
    setShowSavedMessage(true);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
        
        {showSavedMessage && (
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-md flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Đã lưu thay đổi
          </div>
        )}
      </div>
      
      <Tabs defaultValue="general">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <TabsList className="flex flex-col items-start h-auto bg-transparent p-0 space-y-1">
              <TabsTrigger 
                value="general" 
                className="w-full justify-start px-2 py-1.5 h-auto data-[state=active]:bg-muted"
              >
                <User className="h-4 w-4 mr-2" />
                Thông tin chung
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="w-full justify-start px-2 py-1.5 h-auto data-[state=active]:bg-muted"
              >
                <Bell className="h-4 w-4 mr-2" />
                Thông báo
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="w-full justify-start px-2 py-1.5 h-auto data-[state=active]:bg-muted"
              >
                <Palette className="h-4 w-4 mr-2" />
                Giao diện
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-full justify-start px-2 py-1.5 h-auto data-[state=active]:bg-muted"
              >
                <Lock className="h-4 w-4 mr-2" />
                Bảo mật
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="w-full justify-start px-2 py-1.5 h-auto data-[state=active]:bg-muted"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Thanh toán
              </TabsTrigger>
              <TabsTrigger 
                value="company" 
                className="w-full justify-start px-2 py-1.5 h-auto data-[state=active]:bg-muted"
              >
                <Building className="h-4 w-4 mr-2" />
                Thông tin công ty
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1">
            <TabsContent value="general" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chung</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cơ bản của hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveChanges}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="siteName">Tên website</Label>
                          <Input 
                            id="siteName" 
                            placeholder="VD: TravelNow" 
                            defaultValue="TravelNow"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="siteUrl">URL website</Label>
                          <Input 
                            id="siteUrl" 
                            placeholder="VD: https://travelnow.com" 
                            defaultValue="https://travelnow.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="siteDescription">Mô tả website</Label>
                        <textarea
                          id="siteDescription"
                          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Mô tả ngắn về website của bạn"
                          defaultValue="Đặt tour du lịch dễ dàng với giá tốt nhất và dịch vụ chất lượng cao"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail">Email liên hệ</Label>
                          <Input 
                            id="contactEmail" 
                            type="email"
                            placeholder="VD: contact@travelnow.com" 
                            defaultValue="contact@travelnow.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Số điện thoại liên hệ</Label>
                          <Input 
                            id="contactPhone" 
                            placeholder="VD: 0123456789" 
                            defaultValue="0123456789"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input 
                          id="address" 
                          placeholder="VD: 123 Đường ABC, Quận XYZ, TP. HCM" 
                          defaultValue="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                        />
                      </div>
                      
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Thông báo</CardTitle>
                  <CardDescription>
                    Cấu hình cách bạn nhận thông báo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email thông báo</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông báo quan trọng qua email
                          </p>
                        </div>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} 
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email marketing</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông tin về khuyến mãi và ưu đãi mới
                          </p>
                        </div>
                        <Switch 
                          checked={marketingEmails} 
                          onCheckedChange={setMarketingEmails} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ứng dụng</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Thông báo đặt tour</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông báo khi có đặt tour mới
                          </p>
                        </div>
                        <Switch 
                          checked={bookingNotifications} 
                          onCheckedChange={setBookingNotifications} 
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Thông báo đánh giá</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông báo khi có đánh giá mới
                          </p>
                        </div>
                        <Switch 
                          checked={reviewNotifications} 
                          onCheckedChange={setReviewNotifications} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Giao diện</CardTitle>
                  <CardDescription>
                    Tùy chỉnh giao diện của ứng dụng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Chế độ tối</Label>
                        <p className="text-sm text-muted-foreground">
                          Bật chế độ tối cho ứng dụng
                        </p>
                      </div>
                      <Switch 
                        checked={darkMode} 
                        onCheckedChange={setDarkMode} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Màu chủ đạo</Label>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border-2 border-white ring-2 ring-blue-500"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-teal-500 cursor-pointer border-2 border-white"></div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Ngôn ngữ</Label>
                      <select 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="vi"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">Tiếng Anh</option>
                      </select>
                    </div>
                    
                    <Button onClick={handleSaveChanges}>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Bảo mật</CardTitle>
                  <CardDescription>
                    Cài đặt bảo mật cho tài khoản của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveChanges}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                        <Input 
                          id="currentPassword" 
                          type="password"
                          placeholder="Nhập mật khẩu hiện tại" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input 
                          id="newPassword" 
                          type="password"
                          placeholder="Nhập mật khẩu mới" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          placeholder="Nhập lại mật khẩu mới" 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Xác thực hai yếu tố</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Bảo vệ tài khoản của bạn với xác thực hai yếu tố
                        </p>
                        <Button variant="outline">Thiết lập 2FA</Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Phiên đăng nhập</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Quản lý các phiên đăng nhập hoạt động của bạn
                        </p>
                        <Button variant="outline">Quản lý phiên đăng nhập</Button>
                      </div>
                      
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Thanh toán</CardTitle>
                  <CardDescription>
                    Quản lý các phương thức thanh toán
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Phương thức thanh toán được hỗ trợ</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="banking" defaultChecked />
                          <Label htmlFor="banking">Chuyển khoản ngân hàng</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="momo" defaultChecked />
                          <Label htmlFor="momo">Ví MoMo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="zalopay" defaultChecked />
                          <Label htmlFor="zalopay">ZaloPay</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="visa" defaultChecked />
                          <Label htmlFor="visa">Thẻ Visa/Mastercard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="cash" defaultChecked />
                          <Label htmlFor="cash">Tiền mặt</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="vnpay" defaultChecked />
                          <Label htmlFor="vnpay">VNPay</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Thông tin ngân hàng</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Tên ngân hàng</Label>
                          <Input 
                            id="bankName" 
                            placeholder="VD: Vietcombank" 
                            defaultValue="Vietcombank"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Số tài khoản</Label>
                          <Input 
                            id="accountNumber" 
                            placeholder="VD: 1234567890" 
                            defaultValue="1234567890"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountName">Tên tài khoản</Label>
                          <Input 
                            id="accountName" 
                            placeholder="VD: NGUYEN VAN A" 
                            defaultValue="CONG TY TRAVELNOW"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="branch">Chi nhánh</Label>
                          <Input 
                            id="branch" 
                            placeholder="VD: TP.HCM" 
                            defaultValue="TP.HCM"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveChanges}>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="company" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin công ty</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin công ty của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveChanges}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Tên công ty</Label>
                        <Input 
                          id="companyName" 
                          placeholder="VD: Công ty TNHH TravelNow" 
                          defaultValue="Công ty TNHH TravelNow"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="businessNumber">Mã số doanh nghiệp</Label>
                        <Input 
                          id="businessNumber" 
                          placeholder="VD: 0123456789" 
                          defaultValue="0123456789"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="companyAddress">Địa chỉ công ty</Label>
                        <Input 
                          id="companyAddress" 
                          placeholder="VD: 123 Đường ABC, Quận XYZ, TP. HCM" 
                          defaultValue="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="taxNumber">Mã số thuế</Label>
                          <Input 
                            id="taxNumber" 
                            placeholder="VD: 0123456789" 
                            defaultValue="0123456789"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input 
                            id="phone" 
                            placeholder="VD: 0123456789" 
                            defaultValue="0123456789"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="legalRepresentative">Người đại diện pháp luật</Label>
                        <Input 
                          id="legalRepresentative" 
                          placeholder="VD: Nguyễn Văn A" 
                          defaultValue="Nguyễn Văn A"
                        />
                      </div>
                      
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;