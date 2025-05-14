import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  Star, 
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const ManageReviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock reviews data
  const reviews = [
    { 
      id: 1, 
      customer: 'Nguyễn Văn A',
      tourId: 1,
      tour: 'Vịnh Hạ Long 2 ngày 1 đêm', 
      rating: 5,
      comment: 'Chuyến đi tuyệt vời! Hướng dẫn viên rất thân thiện và chuyên nghiệp. Cảnh đẹp, ăn ngon, khách sạn sạch sẽ. Tôi sẽ tiếp tục đặt tour tại đây trong tương lai.',
      createdAt: '15/05/2025',
      status: 'approved'
    },
    { 
      id: 2, 
      customer: 'Trần Thị B',
      tourId: 2,
      tour: 'Đà Nẵng - Hội An 3 ngày 2 đêm', 
      rating: 4,
      comment: 'Dịch vụ rất tốt, lịch trình hợp lý. Tuy nhiên, khách sạn có thể tốt hơn một chút. Nhìn chung tôi vẫn rất hài lòng với chuyến đi.',
      createdAt: '14/05/2025',
      status: 'pending'
    },
    { 
      id: 3, 
      customer: 'Lê Văn C',
      tourId: 3,
      tour: 'Phú Quốc 4 ngày 3 đêm', 
      rating: 5,
      comment: 'Đây là lần thứ ba tôi đặt tour qua đây và chưa bao giờ thất vọng. Chất lượng dịch vụ luôn ổn định và đáng tin cậy.',
      createdAt: '12/05/2025',
      status: 'approved'
    },
    { 
      id: 4, 
      customer: 'Phạm Thị D',
      tourId: 5,
      tour: 'Sapa 2 ngày 1 đêm', 
      rating: 2,
      comment: 'Tôi thất vọng với chuyến đi này. Lịch trình quá gấp gáp, không có thời gian tham quan kỹ. Hướng dẫn viên không nhiệt tình. Đồ ăn cũng không ngon.',
      createdAt: '10/05/2025',
      status: 'rejected'
    },
    { 
      id: 5, 
      customer: 'Hoàng Văn E',
      tourId: 4,
      tour: 'Đà Lạt 3 ngày 2 đêm', 
      rating: 3,
      comment: 'Chuyến đi khá ổn nhưng còn một số điểm cần cải thiện. Lịch trình hơi dày đặc và vội vàng. Hướng dẫn viên nhiệt tình nhưng đôi khi thiếu chuyên nghiệp.',
      createdAt: '08/05/2025',
      status: 'pending'
    },
  ];
  
  // Filter reviews based on search term and status
  const filteredReviews = reviews.filter(review => {
    const matchSearchTerm = 
      review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchSearchTerm && matchStatus;
  });
  
  // Handle review approval/rejection
  const handleReviewStatus = (reviewId, newStatus) => {
    console.log(`Updating review ${reviewId} to status: ${newStatus}`);
    // In a real application, this would make an API call to update the status
  };
  
  // Generate star rating display
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? 'bg-gray-100' : ''}>
            Tất cả
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter('pending')} className={statusFilter === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}>
            Chờ duyệt
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter('approved')} className={statusFilter === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
            Đã duyệt
          </Button>
          <Button variant="outline" onClick={() => setStatusFilter('rejected')} className={statusFilter === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}>
            Đã từ chối
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Tìm kiếm đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Lọc sao
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sắp xếp
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map(review => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{review.customer}</h3>
                  <div className="text-sm text-gray-500">{review.createdAt}</div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                    review.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : review.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {review.status === 'approved' 
                      ? 'Đã duyệt'
                      : review.status === 'pending'
                        ? 'Chờ duyệt'
                        : 'Đã từ chối'
                    }
                  </span>
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <div className="mt-2">
                <div className="text-sm font-medium text-gray-700">
                  Tour: <span className="text-primary">{review.tour}</span>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
              
              {review.status === 'pending' && (
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 hover:text-green-800 hover:bg-green-50 border-green-200"
                    onClick={() => handleReviewStatus(review.id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Duyệt
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200"
                    onClick={() => handleReviewStatus(review.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Từ chối
                  </Button>
                </div>
              )}
              
              {review.status === 'rejected' && (
                <div className="mt-4 bg-red-50 p-3 rounded-md border border-red-100">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Lý do từ chối</h4>
                      <p className="text-sm text-red-700">Vi phạm tiêu chuẩn cộng đồng: Đánh giá chứa thông tin tiêu cực, thiếu chính xác</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Không tìm thấy đánh giá nào phù hợp với điều kiện tìm kiếm</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị {filteredReviews.length} của {reviews.length} đánh giá
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>Trước</Button>
          <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
          <Button variant="outline" size="sm" disabled>Sau</Button>
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;