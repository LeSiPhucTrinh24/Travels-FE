import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  FileText,
  Filter
} from 'lucide-react';

// Sample bookings data
const mockBookings = [
  {
    id: 1,
    tourId: 1,
    tourName: 'Vịnh Hạ Long 2 ngày 1 đêm',
    location: 'Hạ Long, Quảng Ninh',
    userId: 101,
    userName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    bookingDate: '2025-05-01',
    travelDate: '2025-06-15',
    numTravelers: 2,
    totalAmount: 5980000,
    status: 'confirmed',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
  },
  {
    id: 2,
    tourId: 3,
    tourName: 'Đà Nẵng - Hội An 3 ngày',
    location: 'Đà Nẵng, Hội An',
    userId: 102,
    userName: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0912345678',
    bookingDate: '2025-05-02',
    travelDate: '2025-06-20',
    numTravelers: 3,
    totalAmount: 7500000,
    status: 'pending',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending',
  },
  {
    id: 3,
    tourId: 2,
    tourName: 'Phú Quốc - Đảo Ngọc',
    location: 'Phú Quốc, Kiên Giang',
    userId: 103,
    userName: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0923456789',
    bookingDate: '2025-05-03',
    travelDate: '2025-07-01',
    numTravelers: 4,
    totalAmount: 8400000,
    status: 'confirmed',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
  },
  {
    id: 4,
    tourId: 4,
    tourName: 'Sapa - Thung lũng Mường Hoa',
    location: 'Sapa, Lào Cai',
    userId: 104,
    userName: 'Phạm Văn D',
    email: 'phamvand@example.com',
    phone: '0934567890',
    bookingDate: '2025-05-04',
    travelDate: '2025-06-25',
    numTravelers: 2,
    totalAmount: 5580000,
    status: 'cancelled',
    paymentMethod: 'credit_card',
    paymentStatus: 'refunded',
  },
  {
    id: 5,
    tourId: 1,
    tourName: 'Vịnh Hạ Long 2 ngày 1 đêm',
    location: 'Hạ Long, Quảng Ninh',
    userId: 105,
    userName: 'Hoàng Thị E',
    email: 'hoangthie@example.com',
    phone: '0945678901',
    bookingDate: '2025-05-05',
    travelDate: '2025-07-05',
    numTravelers: 3,
    totalAmount: 5980000,
    status: 'confirmed',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
  },
];

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

const ManageBookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Simulating API call with React Query
  const { 
    data: bookings = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['/api/admin/bookings'],
    queryFn: () => Promise.resolve(mockBookings),
    staleTime: Infinity,
  });
  
  // Filter bookings based on search query and status
  const filteredBookings = bookings.filter(
    (booking) => {
      const matchesSearch = 
        booking.tourName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toString().includes(searchQuery);
      
      const matchesStatus = 
        statusFilter === 'all' ||
        booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );
  
  // Handle booking status update
  const handleUpdateStatus = (id, newStatus) => {
    console.log(`Updating booking ${id} status to ${newStatus}`);
    // In a real app, we would make an API call to update the booking status
    // and then invalidate the query to refresh the data
  };
  
  // Count bookings by status
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
  
  // Calculate total revenue
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((total, booking) => total + booking.totalAmount, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý đặt tour</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Tất cả
          </Button>
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Đang chờ
          </Button>
          <Button 
            variant={statusFilter === 'confirmed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('confirmed')}
          >
            Đã xác nhận
          </Button>
          <Button 
            variant={statusFilter === 'cancelled' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('cancelled')}
          >
            Đã hủy
          </Button>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center w-full max-w-sm space-x-2 mr-4">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button type="submit" size="sm" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Tìm kiếm</span>
          </Button>
        </div>
        
        <Button variant="outline" size="sm" className="ml-auto">
          <FileText className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số đặt tour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Trong tháng hiện tại</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã xác nhận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedCount}</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>{Math.round((confirmedCount / bookings.length) * 100)}% tổng số</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang chờ xác nhận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <div className="flex items-center text-sm text-amber-500 mt-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>Cần xử lý</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>Từ {confirmedCount} đặt tour</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đặt tour</CardTitle>
          <CardDescription>
            Quản lý tất cả các đặt tour trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center h-64 text-destructive">
              <p>Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau!</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Calendar className="h-12 w-12 mb-2 opacity-20" />
              <p className="text-center">
                {searchQuery || statusFilter !== 'all'
                  ? "Không tìm thấy đặt tour phù hợp"
                  : "Chưa có đặt tour nào"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Thông tin tour</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Ngày đi</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.tourName}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {booking.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.userName}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <User className="h-3.5 w-3.5 mr-1" />
                            {booking.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(booking.bookingDate)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{formatDate(booking.travelDate)}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.numTravelers} người
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                      <TableCell>
                        {booking.status === 'confirmed' && (
                          <Badge className="bg-green-500">Đã xác nhận</Badge>
                        )}
                        {booking.status === 'pending' && (
                          <Badge variant="outline" className="text-amber-500 border-amber-500">Đang chờ</Badge>
                        )}
                        {booking.status === 'cancelled' && (
                          <Badge variant="outline" className="text-red-500 border-red-500">Đã hủy</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            
                            {booking.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'confirmed')}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                <span>Xác nhận đặt tour</span>
                              </DropdownMenuItem>
                            )}
                            
                            {booking.status !== 'cancelled' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'cancelled')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                <span>Hủy đặt tour</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageBookings;