import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  MapPin,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

const Reports = () => {
  // Mock data
  const revenueByMonth = [
    { month: "T1", value: 42000000 },
    { month: "T2", value: 56000000 },
    { month: "T3", value: 75000000 },
    { month: "T4", value: 84000000 },
    { month: "T5", value: 95000000 },
    { month: "T6", value: 125000000 },
    { month: "T7", value: 142000000 },
    { month: "T8", value: 180000000 },
    { month: "T9", value: 165000000 },
    { month: "T10", value: 135000000 },
    { month: "T11", value: 120000000 },
    { month: "T12", value: 150000000 },
  ];
  
  const bookingsByMonth = [
    { month: "T1", value: 15 },
    { month: "T2", value: 20 },
    { month: "T3", value: 32 },
    { month: "T4", value: 38 },
    { month: "T5", value: 45 },
    { month: "T6", value: 58 },
    { month: "T7", value: 62 },
    { month: "T8", value: 74 },
    { month: "T9", value: 68 },
    { month: "T10", value: 54 },
    { month: "T11", value: 48 },
    { month: "T12", value: 60 },
  ];
  
  const topDestinations = [
    { name: "Hạ Long", bookings: 124, revenue: 371000000 },
    { name: "Đà Nẵng", bookings: 98, revenue: 294000000 },
    { name: "Phú Quốc", bookings: 86, revenue: 258000000 },
    { name: "Đà Lạt", bookings: 72, revenue: 216000000 },
    { name: "Nha Trang", bookings: 65, revenue: 195000000 },
  ];
  
  // Simple stats data
  const statsData = {
    totalBookings: 574,
    totalRevenue: 1369000000,
    totalCustomers: 235,
    totalTours: 24,
    averageRating: 4.7,
  };
  
  const maxRevenue = Math.max(...revenueByMonth.map(item => item.value));
  const maxBookings = Math.max(...bookingsByMonth.map(item => item.value));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Báo cáo thống kê</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Tháng này
          </Button>
          <Button variant="outline" size="sm">
            Quý này
          </Button>
          <Button size="sm">
            Cả năm
          </Button>
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statsData.totalRevenue)}</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12% so với năm trước</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số đặt tour
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalBookings}</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+8% so với năm trước</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số khách hàng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalCustomers}</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+15% so với năm trước</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số tour
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalTours}</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+5% so với năm trước</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Doanh thu theo tháng</CardTitle>
                <CardDescription>Thống kê doanh thu hàng tháng trong năm</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <div className="flex h-full items-end gap-2">
                {revenueByMonth.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-primary rounded-t w-full" 
                      style={{ 
                        height: `${(item.value / maxRevenue) * 240}px`,
                        minHeight: '10px'
                      }}
                    ></div>
                    <div className="text-xs mt-2">{item.month}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(item.value).replace('₫', '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Đặt tour theo tháng</CardTitle>
                <CardDescription>Thống kê số lượng đặt tour hàng tháng</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <div className="flex h-full items-end gap-2">
                {bookingsByMonth.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-secondary rounded-t w-full" 
                      style={{ 
                        height: `${(item.value / maxBookings) * 240}px`,
                        minHeight: '10px'
                      }}
                    ></div>
                    <div className="text-xs mt-2">{item.month}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top destinations */}
      <Card>
        <CardHeader>
          <CardTitle>Điểm đến phổ biến</CardTitle>
          <CardDescription>
            Những địa điểm được đặt tour nhiều nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topDestinations.map((destination, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{destination.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {destination.bookings} đặt tour
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${(destination.bookings / topDestinations[0].bookings) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center mt-1 text-sm">
                  <span className="text-muted-foreground">
                    {Math.round((destination.bookings / statsData.totalBookings) * 100)}% tổng đặt tour
                  </span>
                  <span className="font-medium">
                    {formatCurrency(destination.revenue)}
                  </span>
                </div>
                
                {index < topDestinations.length - 1 && (
                  <div className="mt-4 mb-4 border-t border-gray-100"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Revenue Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố doanh thu</CardTitle>
          <CardDescription>
            Phân tích doanh thu theo các tiêu chí
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-medium mb-2">Theo loại tour</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Tour biển đảo</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Tour thành phố</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Tour cao nguyên</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Tour di sản</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Theo thời gian</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Tour dài ngày (5+ ngày)</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Tour trung bình (3-4 ngày)</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Tour ngắn ngày (1-2 ngày)</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-rose-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Theo nguồn khách</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Trực tiếp website</span>
                    <span className="text-sm font-medium">62%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Giới thiệu</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Đối tác</span>
                    <span className="text-sm font-medium">13%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '13%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;