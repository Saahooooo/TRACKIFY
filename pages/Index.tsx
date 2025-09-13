import { useState } from "react";
import { HeroSearch } from "@/components/ui/hero-search";
import { BusResults } from "@/components/bus-results";
import { SeatSelection } from "@/components/seat-selection";
import { BookingForm } from "@/components/booking-form";

type AppStep = "search" | "results" | "seats" | "booking";

interface SearchData {
  from: string;
  to: string;
  date: Date;
  passengers: number;
}

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

interface Seat {
  id: string;
  number: string;
  type: "window" | "aisle" | "middle";
  status: "available" | "occupied" | "selected";
  price: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("search");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    setCurrentStep("results");
  };

  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    setCurrentStep("seats");
  };

  const handleSeatContinue = (seats: Seat[]) => {
    setSelectedSeats(seats);
    setCurrentStep("booking");
  };

  const handleBack = (step: AppStep) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      {currentStep === "search" && (
        <HeroSearch onSearch={handleSearch} />
      )}
      
      {currentStep === "results" && searchData && (
        <BusResults 
          route={searchData}
          onSelectBus={handleSelectBus}
        />
      )}
      
      {currentStep === "seats" && selectedBus && (
        <SeatSelection 
          bus={selectedBus}
          onContinue={handleSeatContinue}
          onBack={() => handleBack("results")}
        />
      )}
      
      {currentStep === "booking" && selectedBus && searchData && selectedSeats.length > 0 && (
        <BookingForm 
          bus={selectedBus}
          route={searchData}
          selectedSeats={selectedSeats}
          onBack={() => handleBack("seats")}
        />
      )}
    </div>
  );
};

export default Index;
