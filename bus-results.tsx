import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Wifi, Coffee, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

interface Bus {
  id: string;
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  type: string;
  amenities: string[];
  seatsAvailable: number;
  rating: number;
}

interface BusResultsProps {
  route: {
    from: string;
    to: string;
    date: Date;
  };
  onSelectBus: (bus: Bus) => void;
}

const mockBuses: Bus[] = [
  {
    id: "1",
    operator: "Express Travels",
    departureTime: "06:30",
    arrivalTime: "14:30",
    duration: "8h 0m",
    price: 850,
    type: "AC Sleeper",
    amenities: ["wifi", "coffee", "ac"],
    seatsAvailable: 12,
    rating: 4.5,
  },
  {
    id: "2",
    operator: "Royal Coach",
    departureTime: "09:00",
    arrivalTime: "16:45",
    duration: "7h 45m",
    price: 920,
    type: "Luxury AC",
    amenities: ["wifi", "coffee", "ac"],
    seatsAvailable: 8,
    rating: 4.8,
  },
  {
    id: "3",
    operator: "City Connect",
    departureTime: "14:15",
    arrivalTime: "22:00",
    duration: "7h 45m",
    price: 780,
    type: "AC Seater",
    amenities: ["wifi", "ac"],
    seatsAvailable: 15,
    rating: 4.2,
  },
  {
    id: "4",
    operator: "Night Rider",
    departureTime: "22:30",
    arrivalTime: "06:15",
    duration: "7h 45m",
    price: 950,
    type: "AC Sleeper",
    amenities: ["wifi", "coffee", "ac"],
    seatsAvailable: 6,
    rating: 4.6,
  },
];

const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case "wifi":
      return <Wifi className="h-4 w-4" />;
    case "coffee":
      return <Coffee className="h-4 w-4" />;
    case "ac":
      return <Snowflake className="h-4 w-4" />;
    default:
      return null;
  }
};

export function BusResults({ route, onSelectBus }: BusResultsProps) {
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Route Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <MapPin className="h-4 w-4" />
          <span>{route.from} → {route.to}</span>
          <Badge variant="outline">{route.date.toLocaleDateString()}</Badge>
        </div>
        <h2 className="text-2xl font-bold">Available Buses ({mockBuses.length})</h2>
      </div>

      {/* Bus List */}
      <div className="space-y-4">
        {mockBuses.map((bus) => (
          <Card 
            key={bus.id} 
            className={cn(
              "transition-all duration-300 hover:shadow-card cursor-pointer",
              selectedBusId === bus.id && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedBusId(bus.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{bus.operator}</h3>
                  <p className="text-muted-foreground">{bus.type}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">₹{bus.price}</div>
                  <p className="text-sm text-muted-foreground">{bus.seatsAvailable} seats left</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Timing */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xl font-semibold">{bus.departureTime}</div>
                    <div className="text-sm text-muted-foreground">{route.from}</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {bus.duration}
                    </div>
                    <div className="w-full h-px bg-border my-2"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold">{bus.arrivalTime}</div>
                    <div className="text-sm text-muted-foreground">{route.to}</div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex items-center justify-center gap-2">
                  {bus.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-1 text-muted-foreground">
                      {getAmenityIcon(amenity)}
                    </div>
                  ))}
                  <Badge variant="secondary">★ {bus.rating}</Badge>
                </div>

                {/* Action */}
                <div className="flex justify-end">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBus(bus);
                    }}
                    className="bg-gradient-hero hover:opacity-90 transition-all duration-300"
                  >
                    Select Seats
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}