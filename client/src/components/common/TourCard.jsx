import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Star, Users, Clock } from 'lucide-react';

// Function to format price with thousand separators
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
};

const TourCard = ({ tour }) => {
  const { 
    id, 
    name, 
    description, 
    price, 
    duration, 
    location, 
    imageUrl, 
    rating,
    featured
  } = tour;

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <Badge className="absolute top-2 right-2 bg-primary">
            Nổi bật
          </Badge>
        )}
        <div className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 flex items-center shadow-md">
          <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
          <span className="text-xs font-medium">{rating || '4.5'}</span>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="line-clamp-1">{location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <CardDescription className="line-clamp-2 mb-4 mt-2">
          {description}
        </CardDescription>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            <span>2-10 người</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-bold text-lg text-primary">
          {formatPrice(price)}
        </div>
        <Link to={`/tours/${id}`}>
          <Button size="sm">Xem chi tiết</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TourCard;