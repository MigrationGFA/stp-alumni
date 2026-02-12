import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const timezones = [
  "(UTC-12:00) International Date Line West",
  "(UTC-08:00) Pacific Time (US & Canada)",
  "(UTC-05:00) Eastern Time (US & Canada)",
  "(UTC+00:00) London, Dublin, Lisbon",
  "(UTC+01:00) West Central Africa",
  "(UTC+03:00) Nairobi, East Africa",
];

const eventFormats = ["Live Link", "External Event Link"];

export function CreateEventModal({ open, onOpenChange }) {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Initialize React Hook Form
  const { register, handleSubmit, control, setValue, watch, reset } = useForm({
    defaultValues: {
      eventType: "online",
      eventFormat: "",
      eventName: "",
      timezone: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      address: "",
      venue: "",
      eventLink: "",
      description: "",
      coverImage: null,
    },
  });

  const eventType = watch("eventType");


  const onSubmit = (data) => {
    console.log("Form Data:", data);

    if (
      !data.eventName ||
        !data.startDate ||
        !data.startTime ||
        !data.endDate ||
        !data.endTime
    ) {
        toast("Please fill in all required fields."); 
        return 
    }

    onOpenChange(false);
    reset();
    setPreviewImage(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return alert("Images only");
      if (file.size > 5 * 1024 * 1024) return alert("Max 5MB");

      // Update React Hook Form state
      setValue("coverImage", file);

      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("coverImage", null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create an event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          {/* Cover Image Upload */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewImage ? (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={previewImage}
                  className="w-full h-40 object-cover"
                  alt="Preview"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50"
              >
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Upload a cover image</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum width 480 pixels, 16:9 recommended
                </p>
              </div>
            )}
          </div>

          {/* Event Type (Radio Group) */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Event type</Label>
            <Controller
              name="eventType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online">Online</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-person" id="in-person" />
                    <Label htmlFor="in-person">In person</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* Event Format (Select) */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Event format
            </Label>
            <Controller
              name="eventFormat"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventFormats.map((f) => (
                      <SelectItem
                        key={f}
                        value={f.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Event Name (Standard Input) */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Event name</Label>
            <Input {...register("eventName")} placeholder="Enter event name" />
          </div>

          {/* Timezone (Select) */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Timezone</Label>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Dates & Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Start date
              </Label>
              <Input type="date" {...register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Start time
              </Label>
              <Input type="time" {...register("startTime")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">End date</Label>
              <Input type="date" {...register("endDate")} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">End time</Label>
              <Input type="time" {...register("endTime")} />
            </div>
          </div>
          {eventType === "in-person" && (
            <>
              {/* Address */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Address</Label>
                <Input {...register("address")} rows={4} />
              </div>
              {/* Venue */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Venue</Label>
                <Input {...register("venue")} rows={4} />
              </div>
            </>
          )}

          {/* External Event Link */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              External Event Link
            </Label>
            <Input {...register("eventLink")} rows={4} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Describe your event..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
