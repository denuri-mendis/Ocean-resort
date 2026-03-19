"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "sonner"; // or use your toast library
import api from "@/lib/api";

type RoomFormData = {
  roomNumber: string;
  type: string;
  pricePerNight: number;
  description: string;
  capacity: number;
  available: boolean;
  image: File | null;
};

const roomTypes = [
  "Standard",
  "Deluxe",
  "Luxury",
  "Suite",
  "Family Suite",
  "Ocean View",
  "Presidential",
];

export default function AddRoom() {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormData>({
    defaultValues: {
      roomNumber: "",
      type: "",
      pricePerNight: 0,
      description: "",
      capacity: 2,
      available: true,
      image: null,
    },
  });

  const selectedImage = watch("image");

  // Image preview
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  // React Query mutation
  const addRoomMutation = useMutation({
  mutationFn: async (data: RoomFormData) => {
    const formData = new FormData();

    const roomJson = {
      roomNumber: data.roomNumber,
      type: data.type,
      pricePerNight: data.pricePerNight,
      description: data.description,
      capacity: data.capacity,
      available: data.available,
      deleted: false,
    };
    formData.append("room", new Blob([JSON.stringify(roomJson)], { type: "application/json" }));

    if (data.image) {
      formData.append("image", data.image);
    }

    // Use the axios instance — it auto-adds Bearer token
    const response = await api.post("/rooms", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // axios sets this automatically, but safe to include
      },
    });

    return response.data;
  },

  onSuccess: (data) => {
    toast.success("Room added successfully!");
    reset();
    setPreviewUrl(null);
    setOpen(false);
    console.log("New room:", data);
  },

  onError: (error: any) => {
    toast.error("Failed to add room: " + (error.response?.data?.message || error.message || "Unknown error"));
    console.error("Add room error:", error);
  },
});

  const onSubmit = (data: RoomFormData) => {
    addRoomMutation.mutate(data);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setValue("image", file, { shouldValidate: true });
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setPreviewUrl(null);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-[480px] flex flex-col">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Add New Room</SheetTitle>
          <SheetDescription>
            Fill in the room details. Image is optional but recommended.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-6 overflow-y-auto pb-6"
        >
          {/* Room Number */}
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number *</Label>
            <Input
              id="roomNumber"
              placeholder="e.g. 101"
              {...register("roomNumber", { required: "Room number is required" })}
            />
            {errors.roomNumber && (
              <p className="text-sm text-destructive">{errors.roomNumber.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="pricePerNight">Price per Night *</Label>
            <Input
              id="pricePerNight"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 25000"
              {...register("pricePerNight", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 1, message: "Price must be at least 1" },
              })}
            />
            {errors.pricePerNight && (
              <p className="text-sm text-destructive">{errors.pricePerNight.message}</p>
            )}
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Room Type *</Label>
            <Select
              onValueChange={(val) => setValue("type", val, { shouldValidate: true })}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message || "Please select a type"}</p>
            )}
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (people) *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              placeholder="e.g. 2"
              {...register("capacity", {
                required: "Capacity is required",
                valueAsNumber: true,
                min: { value: 1, message: "At least 1 person" },
              })}
            />
            {errors.capacity && (
              <p className="text-sm text-destructive">{errors.capacity.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g. Luxury room with sea view"
              {...register("description")}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <Label>Room Image (optional)</Label>

            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="room-image"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("room-image")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
              </div>

              {previewUrl && (
                <div className="relative group w-40 h-28 rounded-md overflow-hidden border">
                  <img
                    src={previewUrl}
                    alt="Room preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>

        <SheetFooter className="mt-auto pt-6 border-t">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={addRoomMutation.isPending || isSubmitting}
            className="w-full"
          >
            {addRoomMutation.isPending ? "Adding Room..." : "Add Room"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}