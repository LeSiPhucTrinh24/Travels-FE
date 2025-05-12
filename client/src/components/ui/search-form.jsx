import { useState } from "react";
import { useNavigate } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const SearchForm = () => {
  const [, navigate] = useNavigate();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState();
  const [guests, setGuests] = useState("");
  
  // Fetch destinations from API
  const { data: destinations = [] } = useQuery({
    queryKey: ["/api/destinations"],
    staleTime: Infinity,
  });
  
  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (destination) queryParams.set("destination", destination);
    if (date) queryParams.set("date", format(date, "yyyy-MM-dd"));
    if (guests) queryParams.set("guests", guests);
    
    navigate(`/tours?${queryParams.toString()}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <Label htmlFor="destination" className="block text-sm font-medium text-neutral-dark mb-1">
            Điểm đến
          </Label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn điểm đến" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((dest) => (
                <SelectItem key={dest.id} value={dest.name}>
                  {dest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1">
          <Label htmlFor="date" className="block text-sm font-medium text-neutral-dark mb-1">
            Ngày đi
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-10"
              >
                {date ? (
                  format(date, "dd/MM/yyyy", { locale: vi })
                ) : (
                  <span className="text-muted-foreground">mm/dd/yyyy</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="col-span-1">
          <Label htmlFor="guests" className="block text-sm font-medium text-neutral-dark mb-1">
            Số người
          </Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger>
              <SelectValue placeholder="Số người" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 người</SelectItem>
              <SelectItem value="2">2 người</SelectItem>
              <SelectItem value="3">3 người</SelectItem>
              <SelectItem value="4">4 người</SelectItem>
              <SelectItem value="5+">5+ người</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 flex items-end">
          <Button 
            className="w-full bg-primary hover:bg-secondary text-white"
            onClick={handleSearch}
          >
            <span>Tìm kiếm</span>
            <Search className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
