import { Link } from "wouter";
import { MapPin, Calendar, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const TourCard = ({ tour }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount) + 'đ';
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img 
        src={tour.imageUrl} 
        alt={tour.name} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold font-poppins">{tour.name}</h3>
          <span className="bg-primary text-white text-sm px-2 py-1 rounded-md">
            {formatCurrency(tour.price)}
          </span>
        </div>
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{tour.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
            <span>
              {tour.rating.toFixed(1)} ({tour.reviewCount} đánh giá)
            </span>
          </div>
        </div>
        <Link href={`/tour/${tour.id}`}>
          <a className="block w-full bg-primary hover:bg-secondary text-white text-center py-2 rounded-md transition duration-200">
            Xem chi tiết
          </a>
        </Link>
      </CardContent>
    </Card>
  );
};

export default TourCard;
