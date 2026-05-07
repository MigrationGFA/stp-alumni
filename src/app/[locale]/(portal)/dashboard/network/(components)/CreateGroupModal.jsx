"use client";

import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import groupService from "@/lib/services/groupService";
import { useAuth } from "@/lib/hooks/useUser";

export default function CreateGroupModal({ isOpen, onClose, onCreateSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { data: authData } = useAuth();
  const nameInputRef = useRef(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setThumbnailUrl("");
      setErrors({});
      // Focus name input after animation
      setTimeout(() => nameInputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Group name is required";
    if (name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!description.trim()) newErrors.description = "Description is required";
    if (description.trim().length < 10) newErrors.description = "Description must be at least 10 characters";
    if (thumbnailUrl && !/^https?:\/\/.+/.test(thumbnailUrl)) {
      newErrors.thumbnailUrl = "Please enter a valid URL";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const response = await groupService.createGroup({
        name: name.trim(),
        description: description.trim(),
        thumbnailUrl: thumbnailUrl.trim() || null,
      });

      if (response?.status || response?.success) {
        toast.success(response.message || "Group created successfully!");
        
        // Pass new group data back to parent for optimistic update
        if (response.data) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
          onCreateSuccess?.(response.data);
        }
        
        onClose();
      } else {
        toast.error(response?.message || "Failed to create group");
      }
    } catch (error) {
      console.error("Create group error:", error);
      toast.error(error.response?.data?.message || "An error occurred while creating the group");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbnailChange = (e) => {
    const url = e.target.value;
    setThumbnailUrl(url);
    // Clear error when user starts typing
    if (errors.thumbnailUrl) {
      setErrors(prev => ({ ...prev, thumbnailUrl: null }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-[#020618]">
              Create New Group
            </DialogTitle>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 w-8 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
          <DialogDescription className="text-slate-500">
            Create a public group for alumni to connect and collaborate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium text-[#020618]">
              Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="groupName"
              ref={nameInputRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
              placeholder="e.g., Class of 2020, Fintech Founders"
              className={`h-11 ${errors.name ? "border-red-300 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
              maxLength={100}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
            <p className="text-xs text-slate-400">
              {name.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="groupDescription" className="text-sm font-medium text-[#020618]">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="groupDescription"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              }}
              placeholder="What is this group about? Who should join?"
              className={`min-h-[100px] resize-none ${errors.description ? "border-red-300 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
              maxLength={500}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-slate-400 text-right">
              {description.length}/500 characters
            </p>
          </div>

          {/* Thumbnail URL (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl" className="text-sm font-medium text-[#020618]">
              Cover Image URL <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="thumbnailUrl"
                type="url"
                value={thumbnailUrl}
                onChange={handleThumbnailChange}
                placeholder="https://example.com/image.png"
                className={`pl-10 h-11 ${errors.thumbnailUrl ? "border-red-300 focus:border-red-500" : ""}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.thumbnailUrl && (
              <p className="text-xs text-red-500 mt-1">{errors.thumbnailUrl}</p>
            )}
            <p className="text-xs text-slate-400">
              Paste a link to an image (PNG, JPG, or GIF)
            </p>
            
            {/* Preview */}
            {thumbnailUrl && /^https?:\/\/.+/.test(thumbnailUrl) && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={thumbnailUrl}
                  alt="Preview"
                  className="h-24 w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<p class="p-3 text-xs text-slate-400">Image failed to load</p>';
                  }}
                />
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-[#155DFC]/5 rounded-lg border border-[#155DFC]/10">
            <p className="text-xs text-[#155DFC]">
              🔓 All groups are public and visible to all alumni. Members can post, comment, and invite others.
            </p>
          </div>
        </form>

        <DialogFooter className="pt-4 border-t border-slate-100 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim() || !description.trim()}
            className="flex-1 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Group"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}