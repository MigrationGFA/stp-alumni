"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin, Briefcase, GraduationCap, ExternalLink, Target, Sparkles, Lock,
} from "lucide-react";
import useAuthStore from "@/lib/store/useAuthStore";
import userService from "@/lib/services/userService";
import { toast } from "sonner";

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getProfile,
    staleTime: 5 * 60 * 1000,
  });

  const profile = profileData?.data || profileData || {};
  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const initials = getInitials(displayName);

  return (
    <div className="p-3 sm:p-0">
      <h1 className="text-2xl lg:text-3xl font-bold text-[#233389] mb-6">
        {t("title")}
      </h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">{t("profileTab")}</TabsTrigger>
          <TabsTrigger value="security">{t("securityTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab
            t={t}
            profile={profile}
            displayName={displayName}
            displayEmail={displayEmail}
            initials={initials}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab t={t} updateUser={updateUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** Profile Tab — displays user profile data from the API */
function ProfileTab({ t, profile, displayName, displayEmail, initials, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const sections = [
    {
      icon: Briefcase,
      label: t("sectors"),
      value: profile.sector,
      type: "tags",
    },
    {
      icon: MapPin,
      label: t("location"),
      value: profile.location,
      type: "text",
    },
    {
      icon: Sparkles,
      label: t("skills"),
      value: profile.skills,
      type: "tags",
    },
    {
      icon: GraduationCap,
      label: t("cohort"),
      value: profile.cohort,
      type: "text",
    },
    {
      icon: ExternalLink,
      label: t("linkedin"),
      value: profile.linkedin || profile.linkedInProfile,
      type: "link",
    },
    {
      icon: Target,
      label: t("goals"),
      value: profile.goals,
      type: "text",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8">
      {/* Header with avatar */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b">
        <Avatar className="h-20 w-20 border-2 border-[#155DFC]/20">
          <AvatarImage src={profile.profileImagePath} />
          <AvatarFallback className="bg-[#155DFC] text-white text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
          <p className="text-sm text-gray-500">{displayEmail}</p>
          {profile.cohort && (
            <span className="inline-block mt-1 text-xs bg-[#155DFC]/10 text-[#155DFC] px-2 py-0.5 rounded-full">
              {profile.cohort}
            </span>
          )}
        </div>
      </div>

      {/* Profile details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          if (!section.value || (Array.isArray(section.value) && section.value.length === 0)) return null;

          return (
            <div key={section.label} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Icon className="h-4 w-4" />
                {section.label}
              </div>

              {section.type === "tags" && Array.isArray(section.value) && (
                <div className="flex flex-wrap gap-2">
                  {section.value.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full border border-[#155DFC]/30 text-[#155DFC] text-sm bg-[#155DFC]/5"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {section.type === "text" && (
                <p className="text-sm text-gray-900">{section.value}</p>
              )}

              {section.type === "link" && (
                <a
                  href={section.value.startsWith("http") ? section.value : `https://${section.value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#155DFC] hover:underline break-all"
                >
                  {section.value}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Security Tab — change password form */
function SecurityTab({ t, updateUser }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      toast.success(t("passwordChanged"));
      updateUser({ passwordChangeRequired: false });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t("passwordError"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error(t("fillAllFields"));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t("passwordMinLength"));
      return;
    }
    if (newPassword === oldPassword) {
      toast.error(t("passwordSameAsOld"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    changePasswordMutation.mutate({ oldPassword, newPassword });
  };

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#155DFC]/10 rounded-lg">
          <Lock className="h-5 w-5 text-[#155DFC]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("changePassword")}</h2>
          <p className="text-sm text-gray-500">{t("changePasswordDesc")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="oldPassword" className="text-gray-700 mb-2 block">
            {t("oldPassword")}
          </Label>
          <Input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder={t("oldPasswordPlaceholder")}
            disabled={changePasswordMutation.isPending}
          />
        </div>

        <div>
          <Label htmlFor="newPassword" className="text-gray-700 mb-2 block">
            {t("newPassword")}
          </Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("newPasswordPlaceholder")}
            disabled={changePasswordMutation.isPending}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block">
            {t("confirmPassword")}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("confirmPasswordPlaceholder")}
            disabled={changePasswordMutation.isPending}
          />
        </div>

        <Button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white mt-2"
        >
          {changePasswordMutation.isPending ? t("updating") : t("updatePassword")}
        </Button>
      </form>
    </div>
  );
}
