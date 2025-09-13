import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Seat {
  id: string;
  number: string;
  price: number;
}

interface BookingFormProps {
  bus: {
    operator: string;
    type: string;
    departureTime: string;
    arrivalTime: string;
  };
  route: {
    from: string;
    to: string;
    date: Date;
  };
  selectedSeats: Seat[];
  onBack: () => void;
}

interface PassengerDetails {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
}

export function BookingForm({ bus, route, selectedSeats, onBack }: BookingFormProps) {
  const { toast } = useToast();
  const [passengers, setPassengers] = useState<PassengerDetails[]>(
    selectedSeats.map(() => ({
      name: "",
      age: "",
      gender: "",
      phone: "",
      email: "",
    }))
  );

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const taxes = Math.round(totalAmount * 0.05); // 5% tax
  const finalAmount = totalAmount + taxes;

  const updatePassenger = (index: number, field: keyof PassengerDetails, value: string) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ));
  };

  const handlePayment = () => {
    // Validate all passenger details
    const isValid = passengers.every(passenger => 
      passenger.name && passenger.age && passenger.gender && 
      passenger.phone && passenger.email
    );

    if (!isValid) {
      toast({
        title: "Incomplete Details",
        description: "Please fill in all passenger details",
        variant: "destructive",
      });
      return;
    }

    // Since this is a frontend-only demo, show success message
    toast({
      title: "Booking Successful!",
      description: "Your bus ticket has been booked successfully. You will receive a confirmation email shortly.",
    });

    // Reset form or redirect to confirmation page
    setTimeout(() => {
      window.location.reload(); // Simple reset for demo
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Back to seat selection
        </Button>
        <h2 className="text-2xl font-bold">Complete Your Booking</h2>
        <p className="text-muted-foreground">Fill passenger details and proceed to payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Passenger Details Form */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSeats.map((seat, index) => (
            <Card key={seat.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Passenger {index + 1}
                  <Badge variant="outline">Seat {seat.number}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${index}`}>Full Name *</Label>
                    <Input
                      id={`name-${index}`}
                      placeholder="Enter full name"
                      value={passengers[index]?.name || ""}
                      onChange={(e) => updatePassenger(index, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`age-${index}`}>Age *</Label>
                    <Input
                      id={`age-${index}`}
                      type="number"
                      placeholder="Enter age"
                      value={passengers[index]?.age || ""}
                      onChange={(e) => updatePassenger(index, "age", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`gender-${index}`}>Gender *</Label>
                    <select
                      id={`gender-${index}`}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={passengers[index]?.gender || ""}
                      onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                    <Input
                      id={`phone-${index}`}
                      placeholder="Enter phone number"
                      value={passengers[index]?.phone || ""}
                      onChange={(e) => updatePassenger(index, "phone", e.target.value)}
                    />
                  </div>
                  {index === 0 && (
                    <div className="md:col-span-2">
                      <Label htmlFor={`email-${index}`}>Email Address *</Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        placeholder="Enter email address"
                        value={passengers[index]?.email || ""}
                        onChange={(e) => updatePassenger(index, "email", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Journey Details */}
              <div>
                <h4 className="font-medium mb-2">Journey Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span>{route.from} → {route.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{route.date.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bus:</span>
                    <span>{bus.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{bus.departureTime}</span>
                  </div>
                </div>
              </div>

              <hr />

              {/* Seat Details */}
              <div>
                <h4 className="font-medium mb-2">Selected Seats</h4>
                <div className="space-y-1">
                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="flex justify-between text-sm">
                      <span>Seat {seat.number}</span>
                      <span>₹{seat.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes & Fees:</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>₹{finalAmount}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-travel"
                onClick={handlePayment}
              >
                Pay ₹{finalAmount}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By proceeding, you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}