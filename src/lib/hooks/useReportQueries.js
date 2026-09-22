'use client';
import { useMutation } from '@tanstack/react-query';
import reportService from '@/lib/services/reportService';
import { toast } from 'sonner';

export function useReportPost() {
  return useMutation({
    mutationFn: ({ postId, reason, description }) => reportService.reportPost(postId, { reason, description }),
    onSuccess: (data) => {
      toast.success(data?.message || 'Post reported successfully');
    },
    onError: (error) => {
      const status = error?.response?.status ? `[HTTP ${error.response.status}] ` : '';
      const message = error?.response?.data?.message || error?.message || 'Failed to report post';
      toast.error(`${status}${message}`);
    },
  });
}
