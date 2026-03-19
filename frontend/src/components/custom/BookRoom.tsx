"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Loader2, CheckCircle2, XCircle, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type BookingFormData = {
  guestName: string;
  contactNumber: string;
  address: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
};

interface BookRoomProps {
  roomId: string;
  roomNumber?: string;
  pricePerNight?: number;
}

export default function BookRoom({ roomId, roomNumber, pricePerNight = 0 }: BookRoomProps) {
  const [open, setOpen] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "available" | "unavailable">("idle");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      guestName: "",
      contactNumber: "",
      address: "",
      checkInDate: undefined,
      checkOutDate: undefined,
    },
  });

  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");

  // Calculate nights and total
  const nights = checkInDate && checkOutDate 
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const totalAmount = nights * pricePerNight;

  // Automatically check availability when both dates are selected
  useEffect(() => {
    const checkAvailability = async () => {
      if (!checkInDate || !checkOutDate) {
        setAvailabilityStatus("idle");
        return;
      }

      setIsCheckingAvailability(true);
      setAvailabilityStatus("idle");

      try {
        const response = await api.post("/reservations/check-availability", {
          roomId,
          checkInDate: format(checkInDate, "yyyy-MM-dd"),
          checkOutDate: format(checkOutDate, "yyyy-MM-dd"),
        });

        if (response.data.available) {
          setAvailabilityStatus("available");
          toast.success("Room is available for selected dates!", {
            duration: 2000,
          });
        } else {
          setAvailabilityStatus("unavailable");
          toast.error("Room is already booked for these dates", {
            description: "Please select different dates",
            duration: 3000,
          });
        }
      } catch (error: any) {
        setAvailabilityStatus("unavailable");
        toast.error("Error checking availability", {
          description: error.response?.data?.message || error.message,
        });
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    // Add a small delay to avoid too many API calls while user is selecting dates
    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [checkInDate, checkOutDate, roomId]);

  // Create reservation mutation
  const createReservationMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const bookingData = {
        guestName: data.guestName,
        address: data.address,
        contactNumber: data.contactNumber,
        roomId,
        checkInDate: format(data.checkInDate!, "yyyy-MM-dd"),
        checkOutDate: format(data.checkOutDate!, "yyyy-MM-dd"),
      };
      const response = await api.post("/reservations", bookingData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Reservation created successfully!", {
        description: `Reservation #${data.reservationNumber}`,
      });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      reset();
      setAvailabilityStatus("idle");
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error("Failed to create reservation", {
        description: error.response?.data?.message || error.message,
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    if (availabilityStatus !== "available") {
      toast.error("Please ensure the room is available for selected dates");
      return;
    }
    createReservationMutation.mutate(data);
  };

  const handleSheetClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
      setAvailabilityStatus("idle");
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetClose}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <CalendarIcon className="mr-1 h-4 w-4" />
          Book
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-[550px] flex flex-col overflow-hidden">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Book Room</SheetTitle>
          {roomNumber && (
            <SheetDescription>
              Booking for <span className="font-medium">{roomNumber}</span>
            </SheetDescription>
          )}
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Date Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Select Dates
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-in Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkInDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, "PPP") : <span>Pick date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={(date) => setValue("checkInDate", date, { shouldValidate: true })}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Check-out Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOutDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={(date) => setValue("checkOutDate", date, { shouldValidate: true })}
                      disabled={(date) =>
                        date <= (checkInDate ?? new Date(new Date().setHours(0, 0, 0, 0)))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Availability Status */}
            {isCheckingAvailability && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-800">Checking availability...</span>
              </div>
            )}

            {availabilityStatus === "available" && !isCheckingAvailability && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Room is available for selected dates!
                </span>
              </div>
            )}

            {availabilityStatus === "unavailable" && !isCheckingAvailability && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm text-red-800 font-medium">
                  Room is already booked. Please select different dates.
                </span>
              </div>
            )}
          </div>

          {/* Customer Details - Only show if room is available */}
          {availabilityStatus === "available" && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Guest Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="guestName">Guest Name *</Label>
                  <Input
                    id="guestName"
                    placeholder="e.g. Mohamed Atheef"
                    {...register("guestName", { required: "Guest name is required" })}
                  />
                  {errors.guestName && (
                    <p className="text-sm text-destructive">{errors.guestName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Phone Number *</Label>
                  <Input
                    id="contactNumber"
                    placeholder="e.g. +94771234567"
                    {...register("contactNumber", { required: "Phone number is required" })}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="e.g. Negombo, Sri Lanka"
                    {...register("address", { required: "Address is required" })}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Bill Summary */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Reservation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Room Number:</span>
                      <span className="font-medium">{roomNumber}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Check-in:</span>
                      <span className="font-medium">
                        {checkInDate ? format(checkInDate, "PPP") : "-"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Check-out:</span>
                      <span className="font-medium">
                        {checkOutDate ? format(checkOutDate, "PPP") : "-"}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per Night:</span>
                      <span className="font-medium">LKR {pricePerNight.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Number of Nights:</span>
                      <span className="font-medium">{nights}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center pt-1">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-primary">
                        LKR {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Footer with Submit Button */}
        <SheetFooter className="pt-4 border-t mt-auto">
          {availabilityStatus === "available" ? (
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={createReservationMutation.isPending}
              className="w-full h-11"
              size="lg"
            >
              {createReservationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Reservation...
                </>
              ) : (
                <>
                  Confirm & Pay LKR {totalAmount.toLocaleString()}
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled
              variant="secondary"
              className="w-full h-11"
              size="lg"
            >
              Select Available Dates to Continue
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}