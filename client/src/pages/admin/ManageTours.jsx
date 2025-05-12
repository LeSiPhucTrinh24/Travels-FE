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
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Calendar,
  MapPin
} from 'lucide-react';
import { sampleTours, initializeTourWithImage } from '@/lib/mockData';

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

const ManageTours = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulating API call with React Query
  const { 
    data: tours = [], 
    isLoading, 
    isError
  } = useQuery({
    queryKey: ['/api/tours'],
    queryFn: () => Promise.resolve(
      sampleTours.map(tour => initializeTourWithImage({
        ...tour, 
        id: Math.floor(Math.random() * 10000),
        rating: (4 + Math.random()).toFixed(1),
        bookings: Math.floor(Math.random() * 100) + 20,
        reviewCount: Math.floor(Math.random() * 50) + 5,
      }))
    ),
    staleTime: Infinity,
  });
  
  // Filter tours based on search query
  const filteredTours = tours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle tour deletion
  const handleDeleteTour = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      console.log('Deleting tour with ID:', id);
      // In a real app, we would make an API call to delete the tour
      // and then invalidate the query to refresh the data
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Tour</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tour mới
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            type="text"
            placeholder="Tìm kiếm tour theo tên, địa điểm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button type="submit" size="sm" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Tìm kiếm</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Lọc
          </Button>
          <Button variant="outline" size="sm">
            Sắp xếp
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tour</CardTitle>
          <CardDescription>
            Quản lý tất cả các tour du lịch trong hệ thống
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
          ) : filteredTours.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MapPin className="h-12 w-12 mb-2 opacity-20" />
              <p className="text-center">
                {searchQuery
                  ? "Không tìm thấy tour phù hợp"
                  : "Chưa có tour nào được tạo"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Tên tour</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTours.map((tour) => (
                    <TableRow key={tour.id}>
                      <TableCell className="font-medium">{tour.id}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div 
                            className="w-10 h-10 rounded-md mr-3 bg-center bg-cover"
                            style={{ backgroundImage: `url(${tour.imageUrl})` }}
                          />
                          <span className="truncate max-w-[200px]">{tour.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span className="truncate max-w-[150px]">{tour.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span>{tour.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(tour.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                          <span>{tour.rating} ({tour.reviewCount})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {tour.featured ? (
                          <Badge className="bg-primary">Nổi bật</Badge>
                        ) : (
                          <Badge variant="outline">Thường</Badge>
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
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Chỉnh sửa</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteTour(tour.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Xóa</span>
                            </DropdownMenuItem>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số tour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tours.length}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>{tours.filter(t => t.featured).length} tour nổi bật</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng đặt tour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tours.reduce((acc, tour) => acc + (tour.bookings || 0), 0)}
            </div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <span>+12% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đánh giá trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
              {(tours.reduce((acc, tour) => acc + parseFloat(tour.rating || 0), 0) / (tours.length || 1)).toFixed(1)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>Từ {tours.reduce((acc, tour) => acc + (tour.reviewCount || 0), 0)} đánh giá</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageTours;