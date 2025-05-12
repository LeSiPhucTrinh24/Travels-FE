import { useState, useEffect } from 'react';
import { 
  BadgeDollarSign, 
  Users, 
  MapPin, 
  BriefcaseBusiness, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  PieChart
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { sampleTours } from '@/lib/mockData';

// Mô phỏng các dữ liệu cho dashboard
const dashboardData = {
  stats: {
    revenue: {
      value: 352000000,
      percentChange: 12.5,
      isIncrease: true,
    },
    bookings: {
      value: 547,
      percentChange: 8.2,
      isIncrease: true,
    },
    users: {
      value: 2850,
      percentChange: 5.7,
      isIncrease: true,
    },
    tourCount: {
      value: 65,
      percentChange: -2.3,
      isIncrease: false,
    },
  },
  popularDestinations: [
    { id: 1, name: 'Hạ Long', count: 127, percent: 100 },
    { id: 2, name: 'Đà Nẵng', count: 95, percent: 75 },
    { id: 3, name: 'Phú Quốc', count: 84, percent: 66 },
    { id: 4, name: 'Đà Lạt', count: 72, percent: 57 },
    { id: 5, name: 'Nha Trang', count: 63, percent: 50 },
  ],
  recentBookings: [
    { id: 1, tourName: 'Khám phá Vịnh Hạ Long 3 ngày 2 đêm', customer: 'Nguyễn Văn A', date: '12/05/2025', amount: 4500000, status: 'confirmed' },
    { id: 2, tourName: 'Tour Phú Quốc 4 ngày 3 đêm', customer: 'Trần Thị B', date: '11/05/2025', amount: 8200000, status: 'pending' },
    { id: 3, tourName: 'Đà Nẵng - Hội An - Huế 5 ngày', customer: 'Lê Văn C', date: '10/05/2025', amount: 9700000, status: 'confirmed' },
    { id: 4, tourName: 'Đà Lạt city tour 2 ngày', customer: 'Phạm Thị D', date: '09/05/2025', amount: 2500000, status: 'cancelled' },
    { id: 5, tourName: 'Tour Sapa trekking 3 ngày', customer: 'Hoàng Văn E', date: '08/05/2025', amount: 3800000, status: 'confirmed' },
  ],
  monthlyRevenue: [
    { month: 'T1', value: 150000000 },
    { month: 'T2', value: 180000000 },
    { month: 'T3', value: 220000000 },
    { month: 'T4', value: 270000000 },
    { month: 'T5', value: 290000000 },
    { month: 'T6', value: 320000000 },
    { month: 'T7', value: 380000000 },
    { month: 'T8', value: 360000000 },
    { month: 'T9', value: 310000000 },
    { month: 'T10', value: 280000000 },
    { month: 'T11', value: 240000000 },
    { month: 'T12', value: 290000000 },
  ],
};

// Format tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

// Format số lượng
const formatNumber = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

// Component Card Stats
const StatCard = ({ title, value, icon: Icon, percentChange, isIncrease, isCurrency }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">
              {isCurrency ? formatCurrency(value) : formatNumber(value)}
            </h3>
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          <div className={`flex items-center ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
            {isIncrease ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            <span className="font-medium">{Math.abs(percentChange)}%</span>
          </div>
          <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Component Recent Bookings
const RecentBookingRow = ({ booking }) => {
  const statusClasses = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  
  const statusLabels = {
    confirmed: 'Đã xác nhận',
    pending: 'Đang chờ',
    cancelled: 'Đã hủy',
  };
  
  return (
    <tr className="border-b border-gray-200">
      <td className="px-4 py-3 text-sm">{booking.tourName}</td>
      <td className="px-4 py-3 text-sm">{booking.customer}</td>
      <td className="px-4 py-3 text-sm">{booking.date}</td>
      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(booking.amount)}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[booking.status]}`}>
          {statusLabels[booking.status]}
        </span>
      </td>
    </tr>
  );
};

// Component Chart (simple representation since we're not using a real chart library)
const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center" style={{ width: `${100 / data.length}%` }}>
            <div className="w-full px-1">
              <div 
                className="bg-primary rounded-t-sm" 
                style={{ 
                  height: `${(item.value / maxValue) * 150}px`, 
                  minHeight: '10px', 
                  transition: 'height 0.3s ease'
                }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 mt-1">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Biểu đồ donut đơn giản
const SimplePieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let currentOffset = 0;
  
  // Màu sắc cho các phần
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  return (
    <div className="relative h-48 w-48 mx-auto">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {data.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const degrees = percentage * 3.6; // 3.6 degrees per percent
          const offset = currentOffset;
          currentOffset += degrees;
          
          return (
            <circle 
              key={index}
              cx="50" 
              cy="50" 
              r="40"
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth="20"
              strokeDasharray={`${percentage * 2.51} 251`} // 2.51 = 40 * 2 * PI / 100
              strokeDashoffset={`${-offset * 2.51 / 3.6 + 62.75}`} // 62.75 = 40 * 2 * PI / 4 (start at top)
              transform="rotate(-90 50 50)"
            />
          );
        })}
        <circle cx="50" cy="50" r="30" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="block text-2xl font-bold">{total}</span>
          <span className="text-xs text-gray-500">tổng đặt tour</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [totalTours, setTotalTours] = useState(0);
  
  useEffect(() => {
    // Demo: Đếm tổng số tour từ mockData
    setTotalTours(sampleTours.length);
  }, []);
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Tổng quan về hoạt động kinh doanh của TravelNow
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Doanh thu" 
          value={dashboardData.stats.revenue.value} 
          icon={BadgeDollarSign} 
          percentChange={dashboardData.stats.revenue.percentChange}
          isIncrease={dashboardData.stats.revenue.isIncrease}
          isCurrency={true}
        />
        
        <StatCard 
          title="Đặt tour" 
          value={dashboardData.stats.bookings.value} 
          icon={BriefcaseBusiness} 
          percentChange={dashboardData.stats.bookings.percentChange}
          isIncrease={dashboardData.stats.bookings.isIncrease}
          isCurrency={false}
        />
        
        <StatCard 
          title="Người dùng" 
          value={dashboardData.stats.users.value} 
          icon={Users} 
          percentChange={dashboardData.stats.users.percentChange}
          isIncrease={dashboardData.stats.users.isIncrease}
          isCurrency={false}
        />
        
        <StatCard 
          title="Tours" 
          value={dashboardData.stats.tourCount.value} 
          icon={MapPin} 
          percentChange={dashboardData.stats.tourCount.percentChange}
          isIncrease={dashboardData.stats.tourCount.isIncrease}
          isCurrency={false}
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Doanh thu hàng tháng</CardTitle>
                <CardDescription>Biểu đồ doanh thu theo tháng trong năm 2025</CardDescription>
              </div>
              <div className="flex items-center text-primary text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>11.5% tăng trưởng</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={dashboardData.monthlyRevenue} />
          </CardContent>
        </Card>
        
        {/* Bookings by Destination */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Đặt tour theo điểm đến</CardTitle>
                <CardDescription>Phân bố đặt tour theo các điểm đến</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Năm 2025</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {dashboardData.popularDestinations.map((destination) => (
                  <div key={destination.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{destination.name}</span>
                      <span className="text-sm text-gray-500">{destination.count} đặt</span>
                    </div>
                    <Progress value={destination.percent} className="h-2" />
                  </div>
                ))}
              </div>
              <div>
                <SimplePieChart data={dashboardData.popularDestinations} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Đặt tour gần đây</CardTitle>
              <CardDescription>
                Danh sách các đặt tour mới nhất từ khách hàng
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">Xem tất cả</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentBookings.map((booking) => (
                  <RecentBookingRow key={booking.id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;