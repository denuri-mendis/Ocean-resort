import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, isTomorrow, parseISO, differenceInDays } from 'date-fns';
import api from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import ReservationDetails from '@/components/custom/ReservationDetails';

type Reservation = {
  reservationId: string;
  reservationNumber: string;
  guestName: string;
  address: string;
  contactNumber: string;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  checkInDate: string;   // "2026-02-20"
  checkOutDate: string;
  status: string;
  keyStatus: string;     // "NOT_HANDED" or "HANDED_OVER"
  totalAmount: number;
};

// Skeleton loader component
const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></TableCell>
        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-28" /></TableCell>
        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
        <TableCell><div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" /></TableCell>
        <TableCell><div className="h-8 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
      </TableRow>
    ))}
  </>
);

export default function ManageReservations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch reservations from API
  const { data: reservations = [], isLoading, error, refetch } = useQuery<Reservation[]>({
    queryKey: ["reservations"],
    queryFn: async () => {
      const res = await api.get("/reservations");
      return res.data;
    },
  });

  const filteredReservations = reservations.filter((res) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = (
      res.reservationNumber.toLowerCase().includes(searchLower) ||
      res.guestName.toLowerCase().includes(searchLower) ||
      res.roomNumber.toLowerCase().includes(searchLower)
    );
    
    const matchesStatus = 
      statusFilter === "all" || 
      res.status.toUpperCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Function to download CSV for a reservation
  const downloadCSV = (reservation: Reservation) => {
    try {
      // Calculate number of nights
      const nights = differenceInDays(
        parseISO(reservation.checkOutDate),
        parseISO(reservation.checkInDate)
      );

      // Create CSV content
      const csvContent = [
        // Header
        ['RESERVATION INVOICE'],
        [''],
        ['Reservation Details'],
        ['Reservation Number', reservation.reservationNumber],
        ['Status', reservation.status],
        [''],
        ['Guest Information'],
        ['Guest Name', reservation.guestName],
        ['Contact Number', reservation.contactNumber],
        ['Address', reservation.address],
        [''],
        ['Room Details'],
        ['Room Number', reservation.roomNumber],
        ['Room Type', reservation.roomType],
        ['Price per Night', `LKR ${reservation.pricePerNight.toLocaleString()}`],
        [''],
        ['Stay Details'],
        ['Check-in Date', reservation.checkInDate],
        ['Check-out Date', reservation.checkOutDate],
        ['Number of Nights', nights.toString()],
        [''],
        ['Payment Summary'],
        ['Price per Night', `LKR ${reservation.pricePerNight.toLocaleString()}`],
        ['Number of Nights', nights.toString()],
        ['Total Amount', `LKR ${reservation.totalAmount.toLocaleString()}`],
      ]
        .map(row => row.join(','))
        .join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Reservation_${reservation.reservationNumber}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV downloaded successfully!');
    } catch (error) {
      console.error('CSV download error:', error);
      toast.error('Failed to download CSV');
    }
  };

  const getCheckoutCellClass = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return "text-red-600 font-medium";
      if (isTomorrow(date)) return "text-amber-600 font-medium";
    } catch (e) {
      console.error("Date parse error:", e);
    }
    return "";
  };

  const getCheckoutBadge = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) {
        return <Badge variant="outline" className="ml-2 border-red-500 text-red-600 text-xs">Today</Badge>;
      }
      if (isTomorrow(date)) {
        return <Badge variant="outline" className="ml-2 border-amber-500 text-amber-700 text-xs">Tomorrow</Badge>;
      }
    } catch (e) {
      console.error("Date parse error:", e);
    }
    return null;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":   
        return <Badge className="bg-amber-500 hover:bg-amber-500 text-white">Not Checked In</Badge>;
      case "CHECKED_IN":  
        return <Badge className="bg-blue-600 hover:bg-blue-600 text-white">Checked In</Badge>;
      case "CHECKED_OUT": 
        return <Badge variant="outline" className="border-gray-500 text-gray-700">Checked Out</Badge>;
      case "CANCELLED":   
        return <Badge variant="destructive">Cancelled</Badge>;
      default:            
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load reservations</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Manage Reservations</h1>

        <div className="flex flex-1 sm:flex-initial items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search res#, guest, room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10"
              disabled={isLoading}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
            <SelectTrigger className="w-full sm:w-48 h-10">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="CONFIRMED">Not Checked In</SelectItem>
              <SelectItem value="CHECKED_IN">Checked In</SelectItem>
              <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Reservations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[150px] pl-4">Reservation No</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead className="w-[130px]">Check-in</TableHead>
                  <TableHead className="w-[130px]">Check-out</TableHead>
                  <TableHead className="w-[110px] text-center">Status</TableHead>
                  <TableHead className="w-[100px] text-center">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                      No reservations match your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((res) => (
                    <Sheet key={res.reservationId}>
                      <SheetTrigger asChild>
                        <TableRow className="cursor-pointer hover:bg-muted/70 transition-colors border-b last:border-0">
                          <TableCell className="pl-4 font-medium">{res.reservationNumber}</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <span className="font-medium">{res.roomType}</span>
                              <span className="text-xs text-muted-foreground">Room {res.roomNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{res.guestName}</TableCell>
                          <TableCell className="text-sm">{res.checkInDate}</TableCell>
                          <TableCell className={`text-sm ${getCheckoutCellClass(res.checkOutDate)}`}>
                            {res.checkOutDate}
                            {getCheckoutBadge(res.checkOutDate)}
                          </TableCell>
                          <TableCell className="text-center">{getStatusBadge(res.status)}</TableCell>
                          <TableCell 
                            className="text-center"
                            onClick={(e) => e.stopPropagation()} // Prevent sheet from opening
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadCSV(res)}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </SheetTrigger>

                      <SheetContent className="sm:max-w-[540px] flex flex-col p-0">
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                          <ReservationDetails reservation={res} refetch={refetch} />
                        </div>
                      </SheetContent>
                    </Sheet>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}