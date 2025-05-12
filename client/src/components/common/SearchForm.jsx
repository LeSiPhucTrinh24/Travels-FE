import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock destination options
const destinationOptions = [
  { id: 'halong', name: 'Hạ Long' },
  { id: 'danang', name: 'Đà Nẵng' },
  { id: 'hoian', name: 'Hội An' },
  { id: 'sapa', name: 'Sapa' },
  { id: 'dalat', name: 'Đà Lạt' },
  { id: 'phuquoc', name: 'Phú Quốc' },
  { id: 'nhatrang', name: 'Nha Trang' },
];

const SearchForm = ({ className }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query params
    const queryParams = new URLSearchParams();
    if (destination) queryParams.set('destination', destination);
    if (date) queryParams.set('date', date);
    if (guests) queryParams.set('guests', guests);
    
    // Navigate to tours page with search params
    navigate({
      pathname: '/tours',
      search: queryParams.toString()
    });
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={`${className || ''}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đến</label>
          <div className="relative">
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Chọn điểm đến</option>
              {destinationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đi</label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số người</label>
          <div className="relative">
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full pl-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Chọn số người</option>
              <option value="1">1 người</option>
              <option value="2">2 người</option>
              <option value="3">3 người</option>
              <option value="4">4 người</option>
              <option value="5">5 người</option>
              <option value="6+">6+ người</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;