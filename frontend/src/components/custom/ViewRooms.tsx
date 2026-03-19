"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
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
import { Pencil, Trash2, Upload } from "lucide-react";
import AddRoom from "@/components/custom/AddRoom";
import BookRoom from "@/components/custom/BookRoom";

type Room = {
  id: string;
  roomNumber: string;
  type: string;
  pricePerNight: number;
  description: string;
  capacity: number;
  available: boolean;
  imagePath: string | null;
  deleted: boolean;
};

// Skeleton Loading Component
const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-8" />
        </TableCell>
        <TableCell>
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
        </TableCell>
        <TableCell>
          <div className="h-16 w-24 bg-gray-200 rounded animate-pulse" />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);

export default function ViewRooms() {
  const queryClient = useQueryClient();

  // Fetch rooms
  const { data: rooms = [], isLoading, error } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await api.get("/rooms");
      return res.data;
    },
  });

  const [search, setSearch] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<keyof Room | null>(null);
  const [editValue, setEditValue] = useState<string | number | boolean>("");

  const startEditing = (room: Room, field: keyof Room) => {
    setEditingId(room.id);
    setEditingField(field);
    setEditValue(room[field] ?? "");
  };

  const saveEdit = async (room: Room) => {
    if (!editingId || !editingField) return;

    let finalValue: string | number | boolean = editValue;

    // Type conversion before save
    if (editingField === "pricePerNight" && typeof finalValue === "string") {
      finalValue = Number(finalValue) || room.pricePerNight;
    } else if (editingField === "available") {
      finalValue = finalValue === true || finalValue === "true";
    }

    const updatedData: Partial<Room> = { [editingField]: finalValue };

    try {
      await updateMutation.mutateAsync({ id: room.id, data: updatedData });
      toast.success("Updated successfully");
    } catch (err: any) {
      toast.error("Update failed: " + (err.response?.data?.message || err.message));
    }

    setEditingId(null);
    setEditingField(null);
    setEditValue("");
  };

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Room> }) => {
      const formData = new FormData();
      const roomJson = {
        roomNumber: data.roomNumber,
        type: data.type,
        pricePerNight: data.pricePerNight,
        description: data.description,
        capacity: data.capacity,
        available: data.available,
      };
      formData.append("room", new Blob([JSON.stringify(roomJson)], { type: "application/json" }));

      const res = await api.put(`/rooms/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/rooms/${id}`);
    },
    onSuccess: () => {
      toast.success("Room deleted");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (err: any) => {
      toast.error("Delete failed: " + (err.response?.data?.message || err.message));
    },
  });

  const filteredRooms = (rooms || []).filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = roomTypeFilter === "all" || room.type === roomTypeFilter;
    return matchesSearch && matchesType && !room.deleted;
  });

  if (error) return <div className="text-red-500 text-center p-10">Error: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Manage Rooms</h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search by room number or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
            disabled={isLoading}
          />

          <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter} disabled={isLoading}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Deluxe">Deluxe</SelectItem>
              <SelectItem value="Suite">Suite</SelectItem>
              <SelectItem value="Ocean View">Ocean View</SelectItem>
            </SelectContent>
          </Select>

          <AddRoom />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Rooms List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price (LKR)</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No rooms found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      {/* Room Number */}
                      <TableCell>
                        {editingId === room.id && editingField === "roomNumber" ? (
                          <Input
                            value={editValue as string}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveEdit(room)}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-muted/50 px-1 py-1 rounded"
                            onClick={() => startEditing(room, "roomNumber")}
                          >
                            {room.roomNumber}
                          </div>
                        )}
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        {editingId === room.id && editingField === "type" ? (
                          <Input
                            value={editValue as string}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveEdit(room)}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-muted/50 px-1 py-1 rounded"
                            onClick={() => startEditing(room, "type")}
                          >
                            {room.type}
                          </div>
                        )}
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        {editingId === room.id && editingField === "pricePerNight" ? (
                          <Input
                            type="number"
                            value={editValue as number}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            onBlur={() => saveEdit(room)}
                            autoFocus
                            className="h-8 w-24"
                          />
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-muted/50 px-1 py-1 rounded"
                            onClick={() => startEditing(room, "pricePerNight")}
                          >
                            {room.pricePerNight}
                          </div>
                        )}
                      </TableCell>

                      <TableCell>{room.capacity}</TableCell>

                      {/* Status - Available/Booked (editable via select) */}
                      <TableCell>
                        {editingId === room.id && editingField === "available" ? (
                          <Select
                            value={editValue ? "true" : "false"}
                            onValueChange={(val) => {
                              setEditValue(val === "true");
                              saveEdit(room); // auto-save on change
                            }}
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Available</SelectItem>
                              <SelectItem value="false">Booked</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-muted/50 px-1 py-1 rounded"
                            onClick={() => startEditing(room, "available")}
                          >
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                room.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {room.available ? "Available" : "Booked"}
                            </span>
                          </div>
                        )}
                      </TableCell>

                      {/* Image */}
                      <TableCell>
                        <div
                          className="relative group cursor-pointer"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                const formData = new FormData();
                                formData.append("image", file);
                                api
                                  .put(`/rooms/${room.id}`, formData, {
                                    headers: { "Content-Type": "multipart/form-data" },
                                  })
                                  .then(() => {
                                    toast.success("Image updated");
                                    queryClient.invalidateQueries({ queryKey: ["rooms"] });
                                  })
                                  .catch((err) => {
                                    toast.error("Image update failed: " + err.message);
                                  });
                              }
                            };
                            input.click();
                          }}
                        >
                          {room.imagePath ? (
                            <img
                              src={`http://localhost:8080${room.imagePath}`}
                              alt={room.roomNumber}
                              className="h-16 w-24 object-cover rounded border group-hover:opacity-80 transition-opacity"
                            />
                          ) : (
                            <div className="h-16 w-24 bg-gray-100 flex items-center justify-center rounded border">
                              <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                            <Upload className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Room?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Soft-delete <strong>{room.roomNumber}</strong> — it will no longer appear in active lists.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(room.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <BookRoom 
                            roomId={room.id} 
                            roomNumber={room.roomNumber}
                            pricePerNight={room.pricePerNight}
                          />
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