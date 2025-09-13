import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { CalendarIcon, MapPin, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-bus.jpg";

interface SearchFormData {
  from: string;
  to: string;
  date: Date | undefined;
  passengers: number;
}

interface HeroSearchProps {
  onSearch: (data: SearchFormData) => void;
}

export function HeroSearch({ onSearch }: HeroSearchProps) {
  const [searchData, setSearchData] = useState<SearchFormData>({
    from: "",
    to: "",
    date: undefined,
    passengers: 1,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSearch = () => {
    if (searchData.from && searchData.to && searchData.date) {
      onSearch(searchData);
    }
  };

  const swapCities = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Book Your Journey
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Comfortable buses, affordable prices, reliable service
          </p>
        </div>

        <Card className="p-6 shadow-travel bg-white/95 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* From City */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Departure city"
                  value={searchData.from}
                  onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={swapCities}
                className="rounded-full hover:bg-primary/10"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* To City */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Destination city"
                  value={searchData.to}
                  onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Departure</label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !searchData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchData.date ? format(searchData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchData.date}
                    onSelect={(date) => {
                      setSearchData(prev => ({ ...prev, date }));
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <Button 
              onClick={handleSearch}
              className="bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-travel h-12"
              disabled={!searchData.from || !searchData.to || !searchData.date}
            >
              Search Buses
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}