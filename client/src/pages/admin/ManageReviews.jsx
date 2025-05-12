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
  Trash2, 
  MessageSquare,
  Star,
  MapPin,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ThumbsUp
} from 'lucide-react';

// Sample reviews data
const mockReviews = [
  {
    id: 1,
    tourId: 1,
    tourName: 'Vịnh Hạ Long 2 ngày 1 đêm',
    location: 'Hạ Long, Quảng Ninh',
    userId: 101,
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    comment: 'Chuyến đi tuyệt vời! Hướng dẫn viên rất thân thiện và chuyên nghiệp. Cảnh đẹp, ăn ngon, khách sạn sạch sẽ. Tôi sẽ tiếp tục đặt tour tại đây trong tương lai.',
    createdAt: '2025-05-01',
    status: 'published',
    isVerified: true,
  },
  {
    id: 2,
    tourId: 3,
    tourName: 'Đà Nẵng - Hội An 3 ngày',
    location: 'Đà Nẵng, Hội An',
    userId: 102,
    userName: 'Trần Thị B',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    comment: 'Dịch vụ rất tốt, lịch trình hợp lý. Tuy nhiên, khách sạn có thể tốt hơn một chút. Nhìn chung tôi vẫn rất hài lòng với chuyến đi.',
    createdAt: '2025-05-02',
    status: 'published',
    isVerified: true,
  },
  {
    id: 3,
    tourId: 2,
    tourName: 'Phú Quốc - Đảo Ngọc',
    location: 'Phú Quốc, Kiên Giang',
    userId: 103,
    userName: 'Lê Văn C',
    userAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    rating: 5,
    comment: 'Đây là lần thứ ba tôi đặt tour qua đây và chưa bao giờ thất vọng. Chất lượng dịch vụ luôn ổn định và đáng tin cậy.',
    createdAt: '2025-05-03',
    status: 'published',
    isVerified: true,
  },
  {
    id: 4,
    tourId: 4,
    tourName: 'Sapa - Thung lũng Mường Hoa',
    location: 'Sapa, Lào Cai',
    userId: 104,
    userName: 'Phạm Văn D',
    userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 2,
    comment: 'Dịch vụ không tốt như mong đợi. Hướng dẫn viên thiếu nhiệt tình, khách sạn không sạch sẽ. Sẽ không quay lại nữa.',
    createdAt: '2025-05-04',
    status: 'pending',
    isVerified: false,
  },
  {
    id: 5,
    tourId: 5,
    tourName: 'Đà Lạt thành phố ngàn hoa',
    location: 'Đà Lạt, Lâm Đồng',
    userId: 105,
    userName: 'Hoàng Thị E',
    userAvatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    rating: 1,
    comment: 'Đây là một trải nghiệm tồi tệ nhất của tôi. Thời gian không hợp lý, chỗ ở quá tệ. Tôi rất thất vọng với dịch vụ này!',
    createdAt: '2025-05-05',
    status: 'flagged',
    isVerified: false,
  },
];

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

const ManageReviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  
  // Simulating API call with React Query
  const { 
    data: reviews = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['/api/admin/reviews'],
    queryFn: () => Promise.resolve(mockReviews),
    staleTime: Infinity,
  });
  
  // Filter reviews based on search query, status, and rating
  const filteredReviews = reviews.filter(
    (review) => {
      const matchesSearch = 
        review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.tourName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' ||
        review.status === statusFilter;
      
      const matchesRating = 
        ratingFilter === 'all' ||
        (ratingFilter === '5' && review.rating === 5) ||
        (ratingFilter === '4' && review.rating === 4) ||
        (ratingFilter === '3' && review.rating === 3) ||
        (ratingFilter === '2' && review.rating === 2) ||
        (ratingFilter === '1' && review.rating === 1);
      
      return matchesSearch && matchesStatus && matchesRating;
    }
  );
  
  // Calculate average rating
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;
  
  // Count reviews by rating
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };
  
  // Handle review status update
  const handleUpdateStatus = (id, newStatus) => {
    console.log(`Updating review ${id} status to ${newStatus}`);
    // In a real app, we would make an API call to update the review status
    // and then invalidate the query to refresh the data
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>
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
            Chờ duyệt
          </Button>
          <Button 
            variant={statusFilter === 'published' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('published')}
          >
            Đã duyệt
          </Button>
          <Button 
            variant={statusFilter === 'flagged' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('flagged')}
          >
            Đã gắn cờ
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên, nội dung..."
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
          <span className="text-sm text-muted-foreground">Đánh giá:</span>
          <Button 
            variant={ratingFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setRatingFilter('all')}
          >
            Tất cả
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button 
              key={rating}
              variant={ratingFilter === rating.toString() ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setRatingFilter(rating.toString())}
              className="gap-1"
            >
              {rating} <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số đánh giá
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Từ {new Set(reviews.map(r => r.userId)).size} khách hàng</span>
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
              {averageRating} <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 ml-1" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>Từ {reviews.length} đánh giá</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Phân bố đánh giá
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center text-sm">
                  <div className="flex items-center w-16">
                    {rating} <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 ml-1" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                    <div
                      className={`h-full rounded-full ${
                        rating >= 4 
                          ? 'bg-green-500' 
                          : rating >= 3 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}
                      style={{
                        width: `${(ratingCounts[rating] / reviews.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="w-12 text-right">{ratingCounts[rating]}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đánh giá</CardTitle>
          <CardDescription>
            Quản lý tất cả các đánh giá của khách hàng
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
          ) : filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
              <p className="text-center">
                {searchQuery || statusFilter !== 'all' || ratingFilter !== 'all'
                  ? "Không tìm thấy đánh giá phù hợp"
                  : "Chưa có đánh giá nào"}
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
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Ngày đánh giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium line-clamp-1">{review.tourName}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {review.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                            <img 
                              src={review.userAvatar} 
                              alt={review.userName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{review.userName}</div>
                            {review.isVerified && (
                              <div className="text-xs text-green-600 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Đã xác minh
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="text-lg font-medium mr-1">{review.rating}</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-500 fill-yellow-500' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[300px] line-clamp-2 text-sm">
                          {review.comment}
                        </p>
                      </TableCell>
                      <TableCell>{formatDate(review.createdAt)}</TableCell>
                      <TableCell>
                        {review.status === 'published' && (
                          <Badge className="bg-green-500">Đã duyệt</Badge>
                        )}
                        {review.status === 'pending' && (
                          <Badge variant="outline" className="text-amber-500 border-amber-500">Chờ duyệt</Badge>
                        )}
                        {review.status === 'flagged' && (
                          <Badge variant="outline" className="text-red-500 border-red-500">Đã gắn cờ</Badge>
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
                              <MessageSquare className="mr-2 h-4 w-4" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            
                            {review.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(review.id, 'published')}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                <span>Duyệt đánh giá</span>
                              </DropdownMenuItem>
                            )}
                            
                            {review.status !== 'flagged' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(review.id, 'flagged')}>
                                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Gắn cờ đánh giá</span>
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem onClick={() => handleUpdateStatus(review.id, 'deleted')} className="text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Xóa đánh giá</span>
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
    </div>
  );
};

export default ManageReviews;