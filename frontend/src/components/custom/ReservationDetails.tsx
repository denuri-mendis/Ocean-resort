import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DoorOpen, Key, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from '@/lib/api';

interface Reservation {
  reservationId: string;
  reservationNumber: string;
  guestName: string;
  address: string;
  contactNumber: string;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  keyStatus: string;
  totalAmount: number;
}

interface ReservationDetailsProps {
  reservation: Reservation;
  refetch: () => void;
}

export default function ReservationDetails({ reservation, refetch }: ReservationDetailsProps) {
  const [openCheckoutConfirm, setOpenCheckoutConfirm] = useState(false);

  // Update key status mutation
  const updateKeyStatusMutation = useMutation({
    mutationFn: async (keyStatus: string) => {
      const response = await api.patch(
        `/reservations/${reservation.reservationNumber}/key-status`,
        { keyStatus }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Key status updated successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error("Failed to update key status", {
        description: error.response?.data?.message || error.message,
      });
    },
  });

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `/reservations/${reservation.reservationNumber}/checkout`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Guest checked out successfully!");
      setOpenCheckoutConfirm(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error("Checkout failed", {
        description: error.response?.data?.message || error.message,
      });
    },
  });

  const handleKeyStatusChange = (newStatus: string) => {
    updateKeyStatusMutation.mutate(newStatus);
  };

  const handleCheckOut = () => {
    checkoutMutation.mutate();
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'PPP');
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    const baseClasses = "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (statusUpper) {
      case "CONFIRMED":
        return <Badge className="bg-emerald-600 hover:bg-emerald-600">{status}</Badge>;
      case "CHECKED_IN":
        return <Badge className="bg-blue-600 hover:bg-blue-600">{status}</Badge>;
      case "CHECKED_OUT":
        return <Badge variant="outline" className="border-gray-500">{status}</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getKeyStatusBadge = (keyStatus: string) => {
    if (keyStatus === "HANDED_OVER") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Key Handed</Badge>;
    }
    return <Badge variant="outline" className="border-amber-500 text-amber-700">Not Handed</Badge>;
  };

  const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-2.5 text-sm border-b last:border-none">
      <dt className="text-muted-foreground font-medium tracking-tight">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );

  const canUpdateKeyStatus = reservation.status !== "CHECKED_OUT" && reservation.status !== "CANCELLED";
  const canCheckout = reservation.status !== "CHECKED_OUT" && reservation.status !== "CANCELLED";

  return (
    <>
      <SheetHeader className="mb-6 px-0">
        <SheetTitle className="text-2xl tracking-tight">Reservation Details</SheetTitle>
        <SheetDescription className="text-base">
          {reservation.reservationNumber}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-1 text-sm">
        <dl className="divide-y divide-border">
          <DetailItem label="Reservation No" value={reservation.reservationNumber} />
          <DetailItem label="Guest" value={reservation.guestName} />
          <DetailItem label="Contact" value={reservation.contactNumber} />
          <DetailItem label="Address" value={reservation.address} />
          
          <Separator className="my-3" />
          
          <DetailItem 
            label="Room" 
            value={`${reservation.roomType} (${reservation.roomNumber})`} 
          />
          <DetailItem 
            label="Price/Night" 
            value={`LKR ${reservation.pricePerNight.toLocaleString()}`} 
          />
          <DetailItem 
            label="Check-in" 
            value={formatDate(reservation.checkInDate)} 
          />
          <DetailItem 
            label="Check-out" 
            value={formatDate(reservation.checkOutDate)} 
          />
          
          <Separator className="my-3" />
          
          <DetailItem 
            label="Total Amount" 
            value={
              <span className="text-base font-semibold text-primary">
                LKR {reservation.totalAmount.toLocaleString()}
              </span>
            } 
          />
          <DetailItem label="Status" value={getStatusBadge(reservation.status)} />
        </dl>
      </div>

      {/* Key Handover Section */}
      {canUpdateKeyStatus && (
        <>
          <Separator className="my-6" />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Key Status</span>
              </div>
              {getKeyStatusBadge(reservation.keyStatus)}
            </div>
            
            <Select
              value={reservation.keyStatus}
              onValueChange={handleKeyStatusChange}
              disabled={updateKeyStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_HANDED">Not Handed Over</SelectItem>
                <SelectItem value="HANDED_OVER">Key Handed Over</SelectItem>
              </SelectContent>
            </Select>
            
            {updateKeyStatusMutation.isPending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Updating...</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Button */}
      <div className="mt-8 pt-6 border-t sticky bottom-0 left-0 right-0 bg-background">
        {canCheckout ? (
          <AlertDialog open={openCheckoutConfirm} onOpenChange={setOpenCheckoutConfirm}>
            <AlertDialogTrigger asChild>
              <Button className="w-full gap-2" size="lg">
                <DoorOpen className="h-4 w-4" />
                Check Out Guest
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Check-out</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>Are you sure you want to check out this guest?</p>
                  <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
                    <p><strong>Reservation:</strong> {reservation.reservationNumber}</p>
                    <p><strong>Guest:</strong> {reservation.guestName}</p>
                    <p><strong>Room:</strong> {reservation.roomNumber}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will mark the room as available and complete the reservation.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={checkoutMutation.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCheckOut}
                  disabled={checkoutMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Check-out"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <div className="text-center text-muted-foreground py-3 text-sm">
            {reservation.status === "CHECKED_OUT" 
              ? "Guest has been checked out" 
              : "No actions available for this reservation"}
          </div>
        )}
      </div>
    </>
  );
}