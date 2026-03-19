import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Hotel,
  Users,
  Calendar,
  DoorOpen,
  Key,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  BookOpen,
  Settings,
  BarChart,
} from "lucide-react";

// Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  badge 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  badge?: string;
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Step Component
const InstructionStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon 
}: { 
  number: number; 
  title: string; 
  description: string; 
  icon?: any;
}) => (
  <div className="flex gap-4 mb-6">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        <h4 className="font-semibold">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

// Quick Tip Component
const QuickTip = ({ 
  type = "info", 
  title, 
  children 
}: { 
  type?: "info" | "warning" | "success"; 
  title: string; 
  children: React.ReactNode;
}) => {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  const icons = {
    info: Info,
    warning: AlertCircle,
    success: CheckCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`p-4 rounded-lg border-2 ${styles[type]} mb-4`}>
      <div className="flex gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold mb-1">{title}</h4>
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default function Help() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & Documentation</h1>
            <p className="text-muted-foreground">
              Complete guide to using the Hotel Reservation Management System
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rooms">Room Management</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* About System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5" />
                About the System
              </CardTitle>
              <CardDescription>
                A comprehensive hotel management solution for modern hospitality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Hotel Reservation Management System is a complete solution designed to streamline 
                hotel operations. It provides tools for managing rooms, handling reservations, tracking 
                guests, and monitoring key handovers—all in one intuitive platform.
              </p>
              
              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Key Features</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <FeatureCard
                    icon={Hotel}
                    title="Room Management"
                    description="Add, edit, and manage room inventory with images, pricing, and availability status."
                    badge="CRUD"
                  />
                  <FeatureCard
                    icon={Calendar}
                    title="Smart Reservations"
                    description="Create bookings with automatic date conflict detection and availability checking."
                    badge="Real-time"
                  />
                  <FeatureCard
                    icon={Users}
                    title="Customer Database"
                    description="Maintain guest records with contact information and booking history."
                    badge="Searchable"
                  />
                  <FeatureCard
                    icon={Key}
                    title="Key Tracking"
                    description="Track room key handovers and check-in/check-out status in real-time."
                    badge="Live"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Follow these steps to begin using the system</CardDescription>
            </CardHeader>
            <CardContent>
              <InstructionStep
                number={1}
                title="Add Rooms to Inventory"
                description="Start by adding your hotel rooms. Go to 'Manage Rooms' and click 'Add Room' to create room entries with details like type, price, and capacity."
                icon={Hotel}
              />
              <InstructionStep
                number={2}
                title="Create a Reservation"
                description="Click 'Book' on any available room. Select dates, the system will check availability, then enter guest details to complete the booking."
                icon={Calendar}
              />
              <InstructionStep
                number={3}
                title="Manage Check-ins"
                description="When guests arrive, go to 'Manage Reservations', find their booking, and update the key status to 'Handed Over'."
                icon={Key}
              />
              <InstructionStep
                number={4}
                title="Process Check-outs"
                description="When guests leave, click 'Check Out Guest' in the reservation details. The room will automatically become available again."
                icon={DoorOpen}
              />

              <QuickTip type="success" title="Pro Tip">
                Use the search and filter features to quickly find specific rooms, 
                reservations, or customers. All lists support real-time searching!
              </QuickTip>
            </CardContent>
          </Card>

          {/* System Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>System Navigation</CardTitle>
              <CardDescription>Understanding the main sections</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="dashboard">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      Dashboard
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      The main overview page showing key metrics and statistics:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Total rooms available and occupancy rate</li>
                      <li>Active reservations and revenue statistics</li>
                      <li>Quick access to common actions</li>
                      <li>Recent activity and upcoming check-ins/check-outs</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="rooms">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Hotel className="h-4 w-4" />
                      Manage Rooms
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Complete room inventory management:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Add new rooms with images and details</li>
                      <li>Edit room information (click on any field to edit)</li>
                      <li>Update room pricing and availability status</li>
                      <li>Delete rooms (soft delete - can be restored)</li>
                      <li>Filter rooms by type and search by room number</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reservations">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Manage Reservations
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Handle all booking operations:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>View all reservations with status filters</li>
                      <li>Update key handover status</li>
                      <li>Process guest check-outs</li>
                      <li>Download reservation invoices (CSV format)</li>
                      <li>Search by reservation number, guest name, or room</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="customers">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Customers
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Guest information database:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>View all registered guests</li>
                      <li>Search by name, phone, or address</li>
                      <li>See guest statistics and latest additions</li>
                      <li>Customer data is automatically created with each booking</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROOMS TAB */}
        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5" />
                Room Management Guide
              </CardTitle>
              <CardDescription>
                Learn how to manage your hotel's room inventory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Adding a New Room</h3>
                <InstructionStep
                  number={1}
                  title="Click 'Add Room' Button"
                  description="Navigate to 'Manage Rooms' and click the blue 'Add Room' button in the top-right corner."
                  icon={Plus}
                />
                <InstructionStep
                  number={2}
                  title="Fill Room Details"
                  description="Enter room number, select type (Standard/Deluxe/Suite/Ocean View), set price per night, capacity, and description."
                />
                <InstructionStep
                  number={3}
                  title="Upload Room Image"
                  description="Click 'Choose File' to upload a high-quality image of the room. Supported formats: JPG, PNG, WEBP."
                  icon={Hotel}
                />
                <InstructionStep
                  number={4}
                  title="Save Room"
                  description="Click 'Add Room' to save. The room will appear in the list with 'Available' status."
                  icon={CheckCircle}
                />

                <QuickTip type="info" title="Best Practices">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use clear, descriptive room numbers (e.g., "101", "2A")</li>
                    <li>Upload high-resolution images (recommended: 1200x800px)</li>
                    <li>Set competitive pricing based on room type and amenities</li>
                    <li>Include detailed descriptions highlighting unique features</li>
                  </ul>
                </QuickTip>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Editing Room Information</h3>
                <QuickTip type="success" title="Quick Edit Feature">
                  Click directly on any field in the room table to edit it instantly! 
                  Changes are saved automatically when you click outside the field.
                </QuickTip>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Edit className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Inline Editing</p>
                      <p className="text-sm text-muted-foreground">
                        Click on Room Number, Type, or Price fields to edit them directly in the table.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Hotel className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Update Room Image</p>
                      <p className="text-sm text-muted-foreground">
                        Click on the room image or the upload icon to replace it with a new one.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Change Availability</p>
                      <p className="text-sm text-muted-foreground">
                        Click on the status badge to toggle between "Available" and "Booked".
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Deleting Rooms</h3>
                <InstructionStep
                  number={1}
                  title="Locate the Room"
                  description="Find the room you want to delete in the rooms list."
                />
                <InstructionStep
                  number={2}
                  title="Click Delete Icon"
                  description="Click the trash icon in the 'Actions' column."
                  icon={Trash2}
                />
                <InstructionStep
                  number={3}
                  title="Confirm Deletion"
                  description="A confirmation dialog will appear. Click 'Delete' to confirm."
                />

                <QuickTip type="warning" title="Important Note">
                  Room deletion is a "soft delete". The room is hidden from the list but not 
                  permanently removed from the database. This preserves historical booking data.
                </QuickTip>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Searching & Filtering</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Search className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Search Box</p>
                      <p className="text-sm text-muted-foreground">
                        Type in the search box to find rooms by number or type. Results update in real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Room Type Filter</p>
                      <p className="text-sm text-muted-foreground">
                        Use the dropdown filter to show only specific room types (Standard, Deluxe, Suite, etc.).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RESERVATIONS TAB */}
        <TabsContent value="reservations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reservation Management Guide
              </CardTitle>
              <CardDescription>
                Complete workflow for handling bookings and guest stays
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Creating a Reservation</h3>
                <InstructionStep
                  number={1}
                  title="Select Room and Dates"
                  description="Go to 'Manage Rooms', click 'Book' on an available room. Choose check-in and check-out dates from the calendar."
                  icon={Calendar}
                />
                <InstructionStep
                  number={2}
                  title="Automatic Availability Check"
                  description="The system automatically checks if the room is available for your selected dates. You'll see a green confirmation or red warning."
                  icon={CheckCircle}
                />
                <InstructionStep
                  number={3}
                  title="Enter Guest Details"
                  description="Once availability is confirmed, fill in guest name, phone number, and address."
                  icon={Users}
                />
                <InstructionStep
                  number={4}
                  title="Review & Confirm"
                  description="Review the reservation summary showing room details, dates, price breakdown, and total amount. Click 'Confirm & Pay' to complete."
                />

                <QuickTip type="info" title="Smart Features">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Automatic conflict detection prevents double-booking</li>
                    <li>Real-time price calculation based on number of nights</li>
                    <li>Unique reservation number generated automatically</li>
                    <li>Guest information saved to customer database</li>
                  </ul>
                </QuickTip>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Managing Check-ins</h3>
                <InstructionStep
                  number={1}
                  title="Find Reservation"
                  description="Go to 'Manage Reservations', search for the guest name or reservation number."
                />
                <InstructionStep
                  number={2}
                  title="Open Details"
                  description="Click on the reservation row to open the details panel."
                />
                <InstructionStep
                  number={3}
                  title="Update Key Status"
                  description="In the 'Key Status' section, change from 'Not Handed Over' to 'Key Handed Over'."
                  icon={Key}
                />
                <InstructionStep
                  number={4}
                  title="Automatic Status Update"
                  description="The reservation status automatically changes from 'Not Checked In' to 'Checked In'."
                  icon={CheckCircle}
                />

                <QuickTip type="success" title="Key Tracking Benefits">
                  Track which guests have received their room keys and which are still pending. 
                  This helps prevent confusion and ensures smooth check-in operations.
                </QuickTip>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Processing Check-outs</h3>
                <InstructionStep
                  number={1}
                  title="Open Reservation Details"
                  description="Find and click on the guest's reservation in the list."
                />
                <InstructionStep
                  number={2}
                  title="Click 'Check Out Guest'"
                  description="Scroll to the bottom and click the 'Check Out Guest' button."
                  icon={DoorOpen}
                />
                <InstructionStep
                  number={3}
                  title="Confirm Check-out"
                  description="Review the confirmation dialog showing guest and room details, then click 'Confirm Check-out'."
                />
                <InstructionStep
                  number={4}
                  title="Room Becomes Available"
                  description="The room automatically returns to 'Available' status and can be booked again."
                  icon={CheckCircle}
                />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Downloading Invoices</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Download className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">CSV Download</p>
                      <p className="text-sm text-muted-foreground">
                        Click the download icon in the 'Invoice' column to get a detailed CSV file with all reservation and payment information.
                      </p>
                    </div>
                  </div>
                </div>

                <QuickTip type="info" title="Invoice Contents">
                  <p>Each CSV invoice includes:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Reservation number and status</li>
                    <li>Guest contact information</li>
                    <li>Room details and pricing</li>
                    <li>Stay dates and duration</li>
                    <li>Complete payment breakdown</li>
                  </ul>
                </QuickTip>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Status Filters</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Not Checked In</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Reservations confirmed but guest hasn't arrived yet. Use this to see upcoming check-ins.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Checked In</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Guests currently staying in the hotel. Keys have been handed over.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Checked Out</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Completed stays. Guest has left and room is available for new bookings.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Cancelled</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Reservations that were cancelled. Room was made available again.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CUSTOMERS TAB */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Management Guide
              </CardTitle>
              <CardDescription>
                Understanding the guest database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">About Customer Records</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The customer database automatically stores guest information from every reservation. 
                  You don't need to manually add customers—they're created when you make a booking.
                </p>

                <QuickTip type="info" title="Automatic Creation">
                  Every time you create a reservation and enter guest details, a new customer 
                  record is automatically saved to the database. This builds your guest history over time.
                </QuickTip>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Viewing Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Customer List</p>
                      <p className="text-sm text-muted-foreground">
                        View all registered guests with their name, phone number, and address in an easy-to-scan table.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BarChart className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Statistics Cards</p>
                      <p className="text-sm text-muted-foreground">
                        See total customer count, search results, and most recent guest at a glance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Search className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Search Functionality</p>
                      <p className="text-sm text-muted-foreground">
                        Find guests quickly by typing their name, phone number, or address. Results update instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Data Usage</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Guest History</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the customer database to identify returning guests, view their contact information, 
                      and provide personalized service based on previous stays.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Quick Booking</h4>
                    <p className="text-sm text-muted-foreground">
                      When a repeat guest makes a new reservation, their information is already in the system, 
                      making the booking process faster.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contact Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep all guest contact information organized and searchable in one place for easy access 
                      when you need to reach out.
                    </p>
                  </div>
                </div>

                <QuickTip type="success" title="Best Practice">
                  Regularly review your customer list to identify loyal guests and opportunities 
                  for targeted marketing or special offers for repeat visitors.
                </QuickTip>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Note */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Need More Help?</h4>
              <p className="text-sm text-muted-foreground">
                If you encounter any issues or have questions not covered in this guide, 
                please contact your system administrator or technical support team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}