import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Star, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  MapPin,
  BarChart4
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

// Stat card component
const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        
        {change && (
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'up' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="p-3 rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    // Simulate API call to get dashboard data
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockStats = {
        bookings: {
          total: 156,
          change: '+12%',
          changeType: 'up'
        },
        revenue: {
          total: 12500000,
          change: '+8%',
          changeType: 'up'
        },
        users: {
          total: 345,
          change: '+5%',
          changeType: 'up'
        },
        reviews: {
          total: 78,
          change: '-3%',
          changeType: 'down'
        },
        popularDestinations: [
          { name: 'Hạ Long', bookings: 42 },
          { name: 'Đà Nẵng', bookings: 37 },
          { name: 'Phú Quốc', bookings: 28 },
          { name: 'Đà Lạt', bookings: 26 },
          { name: 'Nha Trang', bookings: 23 }
        ],
        recentBookings: [
          { id: 1, customer: 'Nguyễn Văn A', tour: 'Vịnh Hạ Long 2 ngày 1 đêm', date: '15/05/2025', amount: 1790000, status: 'confirmed' },
          { id: 2, customer: 'Trần Thị B', tour: 'Đà Nẵng - Hội An 3 ngày 2 đêm', date: '14/05/2025', amount: 2590000, status: 'pending' },
          { id: 3, customer: 'Lê Văn C', tour: 'Phú Quốc 4 ngày 3 đêm', date: '12/05/2025', amount: 3490000, status: 'confirmed' },
          { id: 4, customer: 'Phạm Thị D', tour: 'Đà Lạt 3 ngày 2 đêm', date: '10/05/2025', amount: 2190000, status: 'cancelled' },
          { id: 5, customer: 'Hoàng Văn E', tour: 'Sapa 2 ngày 1 đêm', date: '08/05/2025', amount: 1490000, status: 'confirmed' },
        ]
      };
      
      setStats(mockStats);
      setIsLoading(false);
    };
    
    fetchData();
  }, [dateRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setDateRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              dateRange === 'week' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Tuần
          </button>
          <button
            type="button"
            onClick={() => setDateRange('month')}
            className={`px-4 py-2 text-sm font-medium ${
              dateRange === 'month' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-gray-300`}
          >
            Tháng
          </button>
          <button
            type="button"
            onClick={() => setDateRange('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              dateRange === 'year' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Năm
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng booking" 
          value={stats.bookings.total}
          icon={BookOpen}
          change={stats.bookings.change}
          changeType={stats.bookings.changeType}
        />
        <StatCard 
          title="Doanh thu" 
          value={formatCurrency(stats.revenue.total)}
          icon={DollarSign}
          change={stats.revenue.change}
          changeType={stats.revenue.changeType}
        />
        <StatCard 
          title="Người dùng" 
          value={stats.users.total}
          icon={Users}
          change={stats.users.change}
          changeType={stats.users.changeType}
        />
        <StatCard 
          title="Đánh giá" 
          value={stats.reviews.total}
          icon={Star}
          change={stats.reviews.change}
          changeType={stats.reviews.changeType}
        />
      </div>
      
      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Đơn đặt tour gần đây</h2>
            <Link to="/admin/bookings" className="text-primary hover:underline text-sm">
              Xem tất cả
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm">{booking.id}</td>
                    <td className="py-3 px-2 text-sm">{booking.customer}</td>
                    <td className="py-3 px-2 text-sm">{booking.tour}</td>
                    <td className="py-3 px-2 text-sm">{booking.date}</td>
                    <td className="py-3 px-2 text-sm font-medium">{formatCurrency(booking.amount)}</td>
                    <td className="py-3 px-2 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'confirmed' 
                          ? 'Đã xác nhận'
                          : booking.status === 'pending'
                            ? 'Đang xử lý'
                            : 'Đã hủy'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Popular Destinations */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Điểm đến phổ biến</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              <BarChart4 className="h-4 w-4 mr-1" />
              Báo cáo
            </Button>
          </div>
          
          <div className="space-y-4">
            {stats.popularDestinations.map((destination, index) => (
              <div key={destination.name} className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium mr-3">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="font-medium">{destination.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{destination.bookings} đơn</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ 
                        width: `${(destination.bookings / stats.popularDestinations[0].bookings) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Calendar Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Lịch tour sắp tới</h2>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Lịch đầy đủ
          </Button>
        </div>
        
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Chức năng lịch tour</h3>
          <p className="text-gray-600 mb-4">
            Tính năng này sẽ hiển thị lịch chi tiết các tour đã được đặt trong thời gian tới
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;