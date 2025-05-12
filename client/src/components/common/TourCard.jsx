import { Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  MapPin, 
  Heart
} from 'lucide-react';

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

const TourCard = ({ tour }) => {
  const {
    id,
    name,
    location,
    duration,
    price,
    imageUrl,
    rating = "4.5",
    reviewCount = 0,
    description,
    featured = false
  } = tour;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Nổi bật
          </div>
        )}
        
        {/* Save button */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors">
          <Heart className="h-4 w-4 text-gray-500 hover:text-red-500" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold mr-8 text-gray-800 hover:text-primary">
              <Link to={`/tours/${id}`} className="hover:underline">
                {name}
              </Link>
            </h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm font-medium">{rating}</span>
              {reviewCount > 0 && (
                <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{duration}</span>
          </div>
        </div>
        
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-primary font-bold text-lg">
              {formatCurrency(price)}
            </span>
            <span className="text-xs text-gray-500 block">
              /người
            </span>
          </div>
          
          <Link 
            to={`/tours/${id}`}
            className="bg-primary hover:bg-primary/90 text-white font-medium text-sm py-2 px-4 rounded"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;