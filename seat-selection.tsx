import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Seat {
  id: string;
  number: string;
  type: "window" | "aisle" | "middle";
  status: "available" | "occupied" | "selected";
  price: number;
}

interface SeatSelectionProps {
  bus: {
    id: string;
    operator: string;
    type: string;
    price: number;
  };
  onContinue: (selectedSeats: Seat[]) => void;
  onBack: () => void;
}

// Mock seat layout for demonstration
const generateSeats = (basePrice: number): Seat[] => {
  const seats: Seat[] = [];
  const rows = 12;
  const seatsPerRow = 4;
  
  for (let row = 1; row <= rows; row++) {
    for (let seat = 1; seat <= seatsPerRow; seat++) {
      const seatNumber = `${row}${String.fromCharCode(64 + seat)}`;
      let type: "window" | "aisle" | "middle";
      
      if (seat === 1 || seat === 4) type = "window";
      else if (seat === 2 || seat === 3) type = "aisle";
      else type = "middle";
      
      // Randomly make some seats occupied
      const isOccupied = Math.random() < 0.3;
      
      seats.push({
        id: `${row}-${seat}`,
        number: seatNumber,
        type,
        status: isOccupied ? "occupied" : "available",
        price: type === "window" ? basePrice + 50 : basePrice,
      });
    }
  }
  
  return seats;
};

export function SeatSelection({ bus, onContinue, onBack }: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>(() => generateSeats(bus.price));
  const selectedSeats = seats.filter(seat => seat.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const toggleSeat = (seatId: string) => {
    setSeats(prev => prev.map(seat => {
      if (seat.id === seatId && seat.status !== "occupied") {
        return {
          ...seat,
          status: seat.status === "selected" ? "available" : "selected"
        };
      }
      return seat;
    }));
  };

  const getSeatColor = (seat: Seat) => {
    switch (seat.status) {
      case "occupied":
        return "bg-destructive text-destructive-foreground cursor-not-allowed";
      case "selected":
        return "bg-primary text-primary-foreground shadow-travel";
      case "available":
        return seat.type === "window" 
          ? "bg-success/10 hover:bg-success/20 border-success text-success-foreground cursor-pointer"
          : "bg-secondary hover:bg-secondary/80 cursor-pointer";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Back to buses
        </Button>
        <h2 className="text-2xl font-bold">Select Your Seats</h2>
        <p className="text-muted-foreground">{bus.operator} - {bus.type}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Bus Layout</span>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-secondary rounded border"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-success/10 border-success border rounded"></div>
                    <span>Window (+₹50)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-destructive rounded"></div>
                    <span>Occupied</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-card p-6 rounded-travel">
                {/* Driver section */}
                <div className="flex justify-end mb-6">
                  <div className="bg-muted px-4 py-2 rounded-lg text-sm text-muted-foreground">
                    Driver
                  </div>
                </div>
                
                {/* Seats grid */}
                <div className="space-y-3">
                  {Array.from({ length: 12 }, (_, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-5 gap-2 items-center">
                      {/* Left side seats */}
                      <div className="flex gap-1">
                        {seats.slice(rowIndex * 4, rowIndex * 4 + 2).map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat.id)}
                            disabled={seat.status === "occupied"}
                            className={cn(
                              "w-10 h-10 rounded-lg text-xs font-medium transition-all duration-200",
                              getSeatColor(seat),
                              seat.status === "selected" && "scale-105"
                            )}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                      
                      {/* Aisle */}
                      <div className="flex justify-center">
                        <div className="text-xs text-muted-foreground">
                          {rowIndex + 1}
                        </div>
                      </div>
                      
                      {/* Right side seats */}
                      <div className="flex gap-1">
                        {seats.slice(rowIndex * 4 + 2, rowIndex * 4 + 4).map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat.id)}
                            disabled={seat.status === "occupied"}
                            className={cn(
                              "w-10 h-10 rounded-lg text-xs font-medium transition-all duration-200",
                              getSeatColor(seat),
                              seat.status === "selected" && "scale-105"
                            )}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSeats.length > 0 ? (
                <>
                  <div>
                    <h4 className="font-medium mb-2">Selected Seats</h4>
                    <div className="space-y-2">
                      {selectedSeats.map((seat) => (
                        <div key={seat.id} className="flex justify-between items-center">
                          <span>{seat.number}</span>
                          <div className="flex items-center gap-2">
                            {seat.type === "window" && (
                              <Badge variant="outline" className="text-xs">Window</Badge>
                            )}
                            <span>₹{seat.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-travel"
                    onClick={() => onContinue(selectedSeats)}
                  >
                    Continue to Payment
                  </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Please select at least one seat to continue</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}