import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Users } from "lucide-react";

// Customer type matching backend
type Customer = {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
};

// Skeleton loader component
const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell className="pl-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-40" />
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
        </TableCell>
        <TableCell className="pr-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export default function ViewCustomers() {
  const [search, setSearch] = useState("");

  // Fetch customers from API
  const { data: customers = [], isLoading, error } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await api.get("/customers");
      return res.data;
    },
  });

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = search.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.contactNumber.toLowerCase().includes(searchLower) ||
      customer.address.toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load customers</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              Total {customers.length} {customers.length === 1 ? 'customer' : 'customers'}
            </p>
          )}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Stats Cards */}
      {!isLoading && customers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered in system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Search Results</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredCustomers.length}</div>
              <p className="text-xs text-muted-foreground">
                {search ? 'Matching search criteria' : 'All customers shown'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Customer</CardTitle>
              <Badge variant="secondary">Recent</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                {customers[customers.length - 1]?.name || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {customers[customers.length - 1]?.contactNumber || 'No contact'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table Card */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Customer List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-6 w-[250px]">Customer Name</TableHead>
                  <TableHead className="w-[200px]">Phone Number</TableHead>
                  <TableHead className="pr-6">Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-40 text-center text-muted-foreground">
                      {search 
                        ? 'No customers found matching your search' 
                        : 'No customers registered yet'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-muted/60 transition-colors border-b last:border-0"
                    >
                      <TableCell className="pl-6 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {customer.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {customer.contactNumber}
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="max-w-md truncate" title={customer.address}>
                          {customer.address}
                        </div>
                      </TableCell>
                    </TableRow>
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