'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import eventService from '@/lib/services/eventService';
import { toast } from 'sonner';

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, data, formData }) => eventService.updateEvent(eventId, data || formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      toast.success('Event updated successfully');
    },
    onError: (error) => {
      const status = error?.response?.status ? `[HTTP ${error.response.status}] ` : '';
      const message = error?.response?.data?.message || error?.message || 'Failed to update event';
      toast.error(`${status}${message}`);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      toast.success('Event deleted successfully');
    },
    onError: (error) => {
      const status = error?.response?.status ? `[HTTP ${error.response.status}] ` : '';
      const message = error?.response?.data?.message || error?.message || 'Failed to delete event';
      toast.error(`${status}${message}`);
    },
  });
}
