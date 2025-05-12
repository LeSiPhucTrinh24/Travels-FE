import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample dashboard data
const mockStats = {
  totalTours: 24,
  activeBookings: 47,
  totalUsers: 235,
  totalRevenue: 567800000,
  recentBookings: [
    { id: 1, tour: 'Vịnh Hạ Long 2 ngày 1 đêm', user: 'Nguyễn Văn A', date: '2025-05-10', amount: 5980000, status: 'confirmed' },
    { id: 2, tour: 'Đà Nẵng - Hội An 3 ngày', user: 'Trần Thị B', date: '2025-05-09', amount: 7500000, status: 'pending' },
    { id: 3, tour: 'Phú Quốc - Đảo Ngọc', user: 'Lê Văn C', date: '2025-05-08', amount: 8400000, status: 'confirmed' },
    { id: 4, tour: 'Sapa - Thung lũng Mường Hoa', user: 'Phạm Văn D', date: '2025-05-07', amount: 5580000, status: 'cancelled' },
  ],
  popularTours: [
    { id: 1, name: 'Vịnh Hạ Long 2 ngày 1 đêm', bookings: 124, rating: 4.8 },
    { id: 2, name: 'Phú Quốc - Đảo Ngọc', bookings: 98, rating: 4.7 },
    { id: 3, name: 'Đà Nẵng - Hội An 3 ngày', bookings: 86, rating: 4.9 },
    { id: 4, name: 'Sapa - Thung lũng Mường Hoa', bookings: 72, rating: 4.6 },
  ],
};

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

const Dashboard = () => {
  // Simulating API call with React Query
  const { data: stats = mockStats, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    queryFn: () => Promise.resolve(mockStats),
    staleTime: Infinity,
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Tuần này
          </Button>
          <Button variant="outline" size="sm">
            Tháng này
          </Button>
          <Button size="sm">
            Tất cả
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>12% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đặt tour hiện có
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>5% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>18% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số tour
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTours}</div>
            <div className="flex items-center text-sm text-red-500 mt-1">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span>0% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Đặt tour gần đây</CardTitle>
                <CardDescription>Các đặt tour mới nhất trong hệ thống</CardDescription>
              </div>
              <Link to="/admin/bookings">
                <Button variant="outline" size="sm">Xem tất cả</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{booking.tour}</div>
                      <div className="text-sm text-muted-foreground">{booking.user}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(booking.amount)}</div>
                    <div className="text-sm">
                      {booking.status === 'confirmed' && (
                        <span className="text-green-500">Đã xác nhận</span>
                      )}
                      {booking.status === 'pending' && (
                        <span className="text-amber-500">Đang chờ</span>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="text-red-500">Đã hủy</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Popular tours */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Tour phổ biến</CardTitle>
                <CardDescription>Các tour được đặt nhiều nhất</CardDescription>
              </div>
              <Link to="/admin/tours">
                <Button variant="outline" size="sm">Quản lý tour</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularTours.map((tour) => (
                <div key={tour.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{tour.name}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{tour.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{tour.bookings} đặt</div>
                    <Link to={`/admin/tours/${tour.id}`} className="text-sm text-primary flex items-center justify-end">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      <span>Xem chi tiết</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales chart placeholder */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Thống kê doanh thu</CardTitle>
          <CardDescription>Doanh thu tour theo tháng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border rounded-md">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">
                Biểu đồ thống kê doanh thu sẽ được hiển thị ở đây
              </p>
              <Button variant="outline" size="sm">
                Xem báo cáo chi tiết
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;