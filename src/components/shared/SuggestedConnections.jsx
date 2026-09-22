"use client";

import { useMemo } from "react";
import Image from "next/image";
import { MapPin, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";
import { useAuth } from "@/lib/hooks/useUser";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";

export default function SuggestedConnections() {
  const queryClient = useQueryClient();
  const { isProfileLoading } = useAuth();

  // Fetch backend suggested connections (August 2026 endpoint)
  const {
    data: suggestedPayload,
    isLoading: isLoadingSuggested,
    error: suggestedError,
    refetch: refetchSuggested,
  } = useQuery({
    queryKey: ["network", "suggested", 10],
    queryFn: () => networkService.getSuggestedConnections(10),
  });

  const { mutate: connectUser, isPending } = useMutation({
    mutationFn: (data) => networkService.connectToUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network"] });
      toast.success("Connection request sent!");
    },
    onError: (error) => {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send connection request";
      const statusCode = error?.response?.status
        ? ` [HTTP ${error.response.status}]`
        : "";
      toast.error(`Connection Error${statusCode}: ${errorMsg}`);
    },
  });

  const locationSuggestions = useMemo(() => {
    const backendData = suggestedPayload?.data;
    if (Array.isArray(backendData?.byLocation)) return backendData.byLocation;
    if (Array.isArray(backendData)) return backendData.slice(0, 5);
    return [];
  }, [suggestedPayload]);

  const roleSuggestions = useMemo(() => {
    const backendData = suggestedPayload?.data;
    if (Array.isArray(backendData?.byRole)) return backendData.byRole;
    if (Array.isArray(backendData) && backendData.length > 5) return backendData.slice(5, 10);
    return [];
  }, [suggestedPayload]);

  if (isProfileLoading || isLoadingSuggested) {
    return (
      <div className="bg-white rounded-lg p-4 lg:p-6 mb-6">
        <h3 className="font-semibold text-[#233389] mb-4">
          Suggested Connections
        </h3>
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin h-6 w-6 text-[#233389]" />
        </div>
      </div>
    );
  }

  if (suggestedError) {
    const errorMsg =
      suggestedError?.response?.data?.message ||
      suggestedError?.message ||
      "Failed to load suggestions";
    const statusCode = suggestedError?.response?.status
      ? ` [HTTP ${suggestedError.response.status}]`
      : "";

    return (
      <div className="bg-white rounded-lg p-4 lg:p-6 mb-6 border border-red-100">
        <h3 className="font-semibold text-[#233389] mb-2">
          Suggested Connections
        </h3>
        <p className="text-xs text-red-600 font-mono mb-3 break-words">
          Error{statusCode}: {errorMsg}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchSuggested()}
          className="text-xs border-[#233389] text-[#233389]"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (locationSuggestions.length === 0 && roleSuggestions.length === 0) {
    return null;
  }

  const renderUser = (user) => {
    const targetUserId = user.userId || user.id || user.connectionId;
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous";

    let formattedRole = "Professional";
    if (user.title) {
      formattedRole = String(user.title);
    } else if (user.role) {
      formattedRole = String(user.role);
    } else if (user.sector) {
      if (Array.isArray(user.sector)) {
        formattedRole = user.sector.join(", ");
      } else if (
        typeof user.sector === "string" &&
        user.sector.startsWith("[")
      ) {
        try {
          const sectors = JSON.parse(user.sector);
          formattedRole =
            Array.isArray(sectors) && sectors.length > 0
              ? sectors.join(", ")
              : String(user.sector);
        } catch {
          formattedRole = String(user.sector);
        }
      } else {
        formattedRole = String(user.sector);
      }
    }

    return (
      <div
        key={targetUserId}
        className="flex items-center justify-between py-2"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
            {user.profileImagePath || user.profileImageUrl ? (
              <Image
                src={user.profileImagePath || user.profileImageUrl}
                alt={fullName}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500 font-medium text-sm">
                {fullName.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 pr-2">
            <Link
              href={`/dashboard/profile/${targetUserId}`}
              className="hover:underline"
            >
              <p className="font-medium text-xs text-[#233389] truncate">
                {fullName}
              </p>
            </Link>
            <p className="text-xs text-gray-600 truncate">{formattedRole}</p>
            {user.location && (
              <p className="text-[10px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> {user.location}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 rounded-full shrink-0 border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white"
          onClick={() => connectUser({ userId: targetUserId })}
          disabled={isPending}
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 lg:p-6 space-y-6">
      {locationSuggestions.length > 0 && (
        <div>
          <h3 className="font-semibold text-[#233389] mb-4">
            Suggested by Location
          </h3>
          <div className="space-y-1">
            {locationSuggestions.map(renderUser)}
          </div>
        </div>
      )}

      {roleSuggestions.length > 0 && (
        <div>
          <h3 className="font-semibold text-[#233389] mb-4">
            Suggested by Role
          </h3>
          <div className="space-y-1">
            {roleSuggestions.map(renderUser)}
          </div>
        </div>
      )}
    </div>
  );
}
