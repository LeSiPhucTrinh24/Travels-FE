import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, Users, MapPin, Search } from 'lucide-react';

const destinations = [
  { value: "all", label: "Tất cả điểm đến" },
  { value: "halong", label: "Hạ Long" },
  { value: "hoian", label: "Hội An" },
  { value: "sapa", label: "Sapa" },
  { value: "dalat", label: "Đà Lạt" },
  { value: "phuquoc", label: "Phú Quốc" },
  { value: "nhatrang", label: "Nha Trang" },
];

const travelers = [
  { value: "1", label: "1 người" },
  { value: "2", label: "2 người" },
  { value: "3", label: "3 người" },
  { value: "4", label: "4 người" },
  { value: "5", label: "5 người" },
  { value: "6", label: "6+ người" },
];

const SearchForm = ({ variant = "default", onSearch }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("all");
  const [date, setDate] = useState(null);
  const [numTravelers, setNumTravelers] = useState("2");
  
  // Form styling based on variant
  const isHero = variant === "hero";
  const formClass = isHero 
    ? "bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4"
    : "bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-3";
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    const searchParams = {
      destination,
      date: date ? format(date, 'yyyy-MM-dd') : '',
      travelers: numTravelers
    };
    
    if (onSearch) {
      onSearch(searchParams);
    } else {
      // Navigate to search results page with query params
      const queryString = new URLSearchParams(searchParams).toString();
      navigate(`/tours?${queryString}`);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className={formClass}>
      <div className="space-y-2">
        <Label htmlFor="destination">Điểm đến</Label>
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger id="destination" className="w-full">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Chọn điểm đến" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Ngày đi</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              id="date"
            >
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              {date ? (
                format(date, 'dd/MM/yyyy')
              ) : (
                <span className="text-muted-foreground">Chọn ngày</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={vi}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="travelers">Số người</Label>
        <Select value={numTravelers} onValueChange={setNumTravelers}>
          <SelectTrigger id="travelers" className="w-full">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Số người" />
          </SelectTrigger>
          <SelectContent>
            {travelers.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className={`space-y-2 ${isHero ? 'md:self-end' : ''}`}>
        <Label htmlFor="search-btn" className={isHero ? 'md:hidden' : ''}>
          Tìm kiếm
        </Label>
        <Button 
          type="submit" 
          className="w-full"
          id="search-btn"
        >
          <Search className="h-4 w-4 mr-2" />
          Tìm kiếm
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;