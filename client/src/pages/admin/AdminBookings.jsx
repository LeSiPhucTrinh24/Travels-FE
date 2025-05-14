import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Edit, 
  Filter, 
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

const ManageBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock bookings data
  const bookings = [
    { 
      id: 1, 
      customer: 'Nguyễn Văn A', 
      customerEmail: 'nguyenvana@example.com',
      customerPhone: '0912345678',
      tour: 'Vịnh Hạ Long 2 ngày 1 đêm', 
      tourId: 1,
      travelDate: '20/05/2025',
      bookingDate: '15/05/2025', 
      persons: 2,
      amount: 3580000, 
      status: 'confirmed' 
    },
    { 
      id: 2, 
      customer: 'Trần Thị B', 
      customerEmail: 'tranthib@example.com',
      customerPhone: '0923456789',
      tour: 'Đà Nẵng - Hội An 3 ngày 2 đêm', 
      tourId: 2,
      travelDate: '25/05/2025',
      bookingDate: '14/05/2025', 
      persons: 3,
      amount: 7770000, 
      status: 'pending' 
    },
    { 
      id: 3, 
      customer: 'Lê Văn C', 
      customerEmail: 'levanc@example.com',
      customerPhone: '0934567890',
      tour: 'Phú Quốc 4 ngày 3 đêm', 
      tourId: 3,
      travelDate: '05/06/2025',
      bookingDate: '12/05/2025', 
      persons: 2,
      amount: 6980000, 
      status: 'confirmed' 
    },
    { 
      id: 4, 
      customer: 'Phạm Thị D', 
      customerEmail: 'phamthid@example.com',
      customerPhone: '0945678901',
      tour: 'Đà Lạt 3 ngày 2 đêm', 
      tourId: 4,
      travelDate: '01/06/2025',
      bookingDate: '10/05/2025', 
      persons: 4,
      amount: 8760000, 
      status: 'cancelled' 
    },
    { 
      id: 5, 
      customer: 'Hoàng Văn E', 
      customerEmail: 'hoangvane@example.com',
      customerPhone: '0956789012',
      tour: 'Sapa 2 ngày 1 đêm', 
      tourId: 5,
      travelDate: '15/05/2025',
      bookingDate: '08/05/2025', 
      persons: 1,
      amount: 1490000, 
      status: 'confirmed' 
    },
  ];
  
  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(booking => {
    const matchSearchTerm = 
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm);
      
    const matchStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchSearchTerm && matchStatus;
  });
  
  // Handler for status update
  const handleStatusUpdate = (bookingId, newStatus) => {
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`);
    // In a real application, this would make an API call to update the status
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn đặt tour</h1>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? 'bg-gray-100' : ''}>
            Tất cả
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter('pending')} className={statusFilter === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}>
            Đang xử lý
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter('confirmed')} className={statusFilter === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
            Đã xác nhận
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter('cancelled')} className={statusFilter === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}>
            Đã hủy
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Tìm kiếm đơn đặt tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Lọc theo ngày
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sắp xếp
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đi</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900">{booking.id}</td>
                  <td className="py-4 px-4 text-sm">
                    <div className="font-medium text-gray-900">{booking.customer}</div>
                    <div className="text-gray-500 text-xs">{booking.customerEmail}</div>
                    <div className="text-gray-500 text-xs">{booking.customerPhone}</div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{booking.tour}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{booking.travelDate}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{booking.persons} người</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{formatCurrency(booking.amount)}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
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
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="px-2">
                        <Edit className="h-4 w-4 mr-1" />
                        Chi tiết
                      </Button>
                      
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="px-2 text-green-600 hover:text-green-800 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Xác nhận
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Hủy
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy đơn đặt tour nào phù hợp với điều kiện tìm kiếm</p>
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Hiển thị {filteredBookings.length} của {bookings.length} đơn đặt tour
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Trước</Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
            <Button variant="outline" size="sm" disabled>Sau</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;