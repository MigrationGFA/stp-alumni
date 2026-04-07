import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Target,
  Sparkles,
  Building2,
  User,
  Check,
  ChevronsUpDown,
  CloudUpload,
  X,
  Edit3,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SECTORS, SKILL_SUGGESTIONS } from "@/lib/constants/profileOptions";
import {
  BUSINESS_MODELS,
  COMPANY_STAGES,
  ImmutableField,
  NEED_TAGS,
  OFFER_TAGS,
  Tag,
  TagSelector,
  VISIBILITY_OPTIONS,
} from "./page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import userService from "@/lib/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function ProfileTab({
  t,
  profile,
  displayName,
  displayEmail,
  initials,
  isLoading,
}) {
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Personal Profile Card ── */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#155DFC]" />
            <span className="text-sm font-semibold text-gray-800">
              Personal Profile
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingPersonal((v) => !v)}
            className="text-[#155DFC] hover:bg-[#155DFC]/5 gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {editingPersonal ? "Cancel" : "Edit"}
          </Button>
        </div>

        <div className="p-6 lg:p-8">
          {editingPersonal ? (
            <PersonalEditForm
              profile={profile}
              onDone={() => setEditingPersonal(false)}
            />
          ) : (
            <PersonalReadView
              profile={profile}
              displayName={displayName}
              displayEmail={displayEmail}
              initials={initials}
              t={t}
            />
          )}
        </div>
      </div>

      {/* ── Business Profile Card ── */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#155DFC]" />
            <span className="text-sm font-semibold text-gray-800">
              Business Profile
            </span>
            <span className="text-[10px] bg-[#155DFC]/10 text-[#155DFC] px-1.5 py-0.5 rounded font-medium ml-1">
              Marketplace
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingBusiness((v) => !v)}
            className="text-[#155DFC] hover:bg-[#155DFC]/5 gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {editingBusiness ? "Cancel" : "Edit"}
          </Button>
        </div>

        <div className="p-6 lg:p-8">
          {editingBusiness ? (
            <BusinessEditForm
              profile={profile}
              onDone={() => setEditingBusiness(false)}
            />
          ) : (
            <BusinessReadView profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;

// ─── Personal Read View ───────────────────────────────────────────────────────

function PersonalReadView({ profile, displayName, displayEmail, initials, t }) {
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
    { icon: Sparkles, label: t("skills"), value: profile.skills, type: "tags" },
    {
      icon: GraduationCap,
      label: "Job Title",
      value: profile.jobTitle,
      type: "text",
    },
    {
      icon: ExternalLink,
      label: t("linkedin"),
      value: profile.linkedin || profile.linkedInProfile,
      type: "link",
    },
    { icon: Target, label: t("goals"), value: profile.goals, type: "text" },
  ];

  return (
    <>
      {/* Avatar row */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
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
              Cohort {profile.cohort}
            </span>
          )}
        </div>
      </div>

      {/* Immutable cohort notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100 mb-6">
        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">
          <span className="font-semibold">Cohort Year</span> is locked after
          onboarding to maintain platform integrity. Contact an admin to request
          a change.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          if (
            !section.value ||
            (Array.isArray(section.value) && section.value.length === 0)
          )
            return null;
          return (
            <div key={section.label} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                <Icon className="h-3.5 w-3.5" />
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
                  href={
                    section.value.startsWith("http")
                      ? section.value
                      : `https://${section.value}`
                  }
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
    </>
  );
}

function PersonalEditForm({ profile, onDone }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sectors: profile.sector || [],
      skills: profile.skills || [],
      location: profile.location || "",
      linkedInProfile: profile.linkedin || profile.linkedInProfile || "",
      goals: profile.goals || "",
      title: profile.title || "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Personal profile updated!");
      onDone();
    },
  });

  const [sectorOpen, setSectorOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skillOpen, setSkillOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  // const [countries] = useState([
  //   "Nigeria",
  //   "Ghana",
  //   "Kenya",
  //   "South Africa",
  //   "United Kingdom",
  //   "United States",
  //   "France",
  //   "Germany",
  //   "Canada",
  //   "Rwanda",
  //   "Senegal",
  // ]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    profile.profileImagePath || null,
  );
  const profileImageInputRef = useRef(null);

  const sectors = watch("sectors");
  const skills = watch("skills");
  const location = watch("location");
  const linkedInProfile = watch("linkedInProfile");
  const goals = watch("goals");
  const title = watch("title");

  const [countries, setCountries] = useState([]);
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sorted);
      })
      .catch(() => {
        setCountries([
          "Benin",
          "Cameroon",
          "Canada",
          "Côte d'Ivoire",
          "France",
          "Gabon",
          "Germany",
          "Ghana",
          "Kenya",
          "Nigeria",
          "Rwanda",
          "Senegal",
          "South Africa",
          "Togo",
          "United Kingdom",
          "United States",
        ]);
      })
    
  }, []);

  const filteredCountries = locationSearch
    ? countries.filter((c) =>
        c.toLowerCase().includes(locationSearch.toLowerCase()),
      )
    : countries;

  const filteredSkills = SKILL_SUGGESTIONS.filter(
    (s) =>
      !skills.includes(s) && s.toLowerCase().includes(skillInput.toLowerCase()),
  );

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setValue("skills", [...skills, trimmed]);
    }
    setSkillInput("");
    setSkillOpen(false);
  };

  const handleToggleSector = (sector) => {
    const currentSectors = sectors;
    if (currentSectors.includes(sector)) {
      setValue(
        "sectors",
        currentSectors.filter((s) => s !== sector),
      );
    } else {
      setValue("sectors", [...currentSectors, sector]);
    }
  };

  function handleProfileImageChange(e) {

    e.preventDefault()
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

 async function handleProfileImgSubmit(file) {
  if (!file) return null;
  
  try {
    const res = await userService.uploadProfileImage(file);
    
    if (res.status) {
      toast.success("Profile image updated!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      return res.data?.avatarUrl || res.avatarUrl; // Return the URL from response
    } else {
      toast.error(res.message || "Failed to upload profile image.");
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Failed to upload profile image.");
    throw error;
  }
}

const onSubmit = async (data) => {
  try {
    let uploadedImageUrl = profile.profileImagePath;
    
    if (profileImage) {
        console.log(profileImage, "selected file submit");
      uploadedImageUrl = await handleProfileImgSubmit(profileImage);
    }
    
    const personal = {
      sectors: data.sectors,
      location: data.location,
      skills: data.skills,
      linkedInProfile: data.linkedInProfile,
      goal: data.goals,
      title: data.title,
      profileImagePath: uploadedImageUrl,
    };
    
    console.log(personal, "profile data");
    
    // Call your update service
    mutate(personal);
    
  } catch (error) {
    console.error("Submission error:", error);
    // Don't show another error if the image upload already showed one
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Avatar */}
      <div>
        <Label className="text-gray-700 mb-2 block text-sm">
          Profile Photo
        </Label>
        <input
          type="file"
          ref={profileImageInputRef}
          onChange={handleProfileImageChange}
          accept="image/*"
          className="hidden"
          disabled={isPending}
        />
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-[#155DFC]/20">
            <AvatarImage src={imagePreview} />
            <AvatarFallback className="bg-[#155DFC] text-white">
              —
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => profileImageInputRef.current?.click()}
              className="gap-1.5"
            >
              <CloudUpload className="h-3.5 w-3.5" /> Change photo
            </Button>
            {imagePreview && (
              <Button
                variant="ghost"
                type="button"
                size="sm"
                onClick={() => setImagePreview(null)}
                className="text-red-500 hover:text-red-700"
                disabled={isPending}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Immutable: Cohort */}
      <ImmutableField
        label="Cohort Year"
        value={profile.cohort}
        icon={GraduationCap}
      />

      {/* Job Title */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">Job Title</Label>
        <Input
          {...register("title")}
          placeholder="e.g. Co-founder & CEO"
          disabled={isPending}
        />
      </div>

      {/* Location */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">Location</Label>
        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between font-normal"
              disabled={isPending}
            >
              <span className={cn(!location && "text-muted-foreground")}>
                {location || "Select country"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput
                placeholder="Search country..."
                value={locationSearch}
                onValueChange={setLocationSearch}
              />
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup>
                  {filteredCountries.map((country) => (
                    <CommandItem
                      key={country}
                      value={country}
                      onSelect={() => {
                        setValue("location", country);
                        setLocationOpen(false);
                        setLocationSearch("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          location === country ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {country}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Sectors */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">Sectors</Label>
        <Popover open={sectorOpen} onOpenChange={setSectorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between font-normal"
              disabled={isPending}
            >
              <span
                className={cn(sectors.length === 0 && "text-muted-foreground")}
              >
                {sectors.length > 0
                  ? `${sectors.length} selected`
                  : "Select sectors"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput placeholder="Search sector..." />
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup>
                  {SECTORS.map((sector) => (
                    <CommandItem
                      key={sector}
                      value={sector}
                      onSelect={() => handleToggleSector(sector)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          sectors.includes(sector)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {sector}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {sectors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {sectors.map((s) => (
              <Tag key={s} label={s} onRemove={() => handleToggleSector(s)} />
            ))}
          </div>
        )}
      </div>

      {/* Skills */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">Skills</Label>
        <Popover open={skillOpen} onOpenChange={setSkillOpen}>
          <PopoverTrigger asChild>
            <Input
              placeholder="Type a skill and press Enter"
              disabled={isPending}
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                if (e.target.value) setSkillOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && skillInput.trim()) {
                  e.preventDefault();
                  handleAddSkill(skillInput);
                }
              }}
            />
          </PopoverTrigger>
          {filteredSkills.length > 0 && (
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Command>
                <CommandList>
                  <CommandGroup>
                    {filteredSkills.slice(0, 6).map((skill) => (
                      <CommandItem
                        key={skill}
                        value={skill}
                        onSelect={() => handleAddSkill(skill)}
                      >
                        {skill}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          )}
        </Popover>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s, i) => (
              <Tag
                key={i}
                label={s}
                onRemove={() =>
                  setValue(
                    "skills",
                    skills.filter((_, idx) => idx !== i),
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* LinkedIn */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">
          LinkedIn URL
        </Label>
        <Input
          type="url"
          {...register("linkedInProfile")}
          placeholder="https://linkedin.com/in/yourname"
          disabled={isPending}
        />
      </div>

      {/* Goals */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">Goals</Label>
        <textarea
          className="flex min-h-[72px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          rows={3}
          {...register("goals")}
          placeholder="What are you hoping to achieve through the STP network?"
          disabled={isPending}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onDone}
          className="flex-1"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function BusinessReadView({ profile }) {
  const hasData =
    profile.companyName ||
    profile.businessModel ||
    profile.companyStage ||
    profile.elevatorPitch;

  if (!hasData) {
    return (
      <div className="text-center py-8">
        <Building2 className="h-10 w-10 text-gray-200 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No business profile set up yet.</p>
        <p className="text-xs text-gray-400 mt-1">
          Click Edit to add your company details and power your Marketplace
          card.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {profile.companyName || "—"}
          </h3>
          {profile.elevatorPitch && (
            <p className="text-sm text-gray-500 mt-1">
              {profile.elevatorPitch}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {profile.businessModel && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border">
              {profile.businessModel}
            </span>
          )}
          {profile.companyStage && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#155DFC]/10 text-[#155DFC] border border-[#155DFC]/20">
              {profile.companyStage}
            </span>
          )}
        </div>
      </div>

      {/* Offers / Needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {profile.offers?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Can offer
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.offers.map((o) => (
                <span
                  key={o}
                  className="px-3 py-1 rounded-full text-sm bg-emerald-50 border border-emerald-200 text-emerald-700"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
        )}
        {profile.needs?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Looking for
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.needs.map((n) => (
                <span
                  key={n}
                  className="px-3 py-1 rounded-full text-sm bg-blue-50 border border-blue-200 text-blue-700"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visibility */}
      {profile.contactVisibility && (
        <p className="text-xs text-gray-400">
          Contact visibility:{" "}
          <span className="text-gray-600 font-medium">
            {VISIBILITY_OPTIONS.find(
              (o) => o.value === profile.contactVisibility,
            )?.label || profile.contactVisibility}
          </span>
        </p>
      )}
    </div>
  );
}

// ─── Business Edit Form ───────────────────────────────────────────────────────

function BusinessEditForm({ profile, onDone }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      companyName: profile.companyName || "",
      businessModel: profile.businessModel || "",
      companyStage: profile.companyStage || "",
      elevatorPitch: profile.elevatorPitch || "",
      offers: profile.offers || [],
      needs: profile.needs || [],
      visibility: profile.contactVisibility || "EVERYONE",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Business profile updated!");
      onDone();
    },
  });

  const [businessModelOpen, setBusinessModelOpen] = useState(false);
  const [companyStageOpen, setCompanyStageOpen] = useState(false);

  const offers = watch("offers");
  const needs = watch("needs");
  const visibility = watch("visibility");
  const businessModel = watch("businessModel");
  const companyStage = watch("companyStage");

  const handleToggleOffer = (tag) => {
    const currentOffers = offers;
    if (currentOffers.includes(tag)) {
      setValue(
        "offers",
        currentOffers.filter((t) => t !== tag),
      );
    } else {
      setValue("offers", [...currentOffers, tag]);
    }
  };

  const handleToggleNeed = (tag) => {
    const currentNeeds = needs;
    if (currentNeeds.includes(tag)) {
      setValue(
        "needs",
        currentNeeds.filter((t) => t !== tag),
      );
    } else {
      setValue("needs", [...currentNeeds, tag]);
    }
  };

  const onSubmit = (data) => {
    const business = {
      companyName: data.companyName,
      businessModel: data.businessModel,
      companyStage: data.companyStage,
      elevatorPitch: data.elevatorPitch,
      offers: data.offers,
      needs: data.needs,
      contactVisibility: data.visibility,
      // sector:["test1"]
    };
    // TODO: call userService.updateProfile(payload)

    mutate({ business });
    // console.log("Business profile payload:", payload);
    // toast.success("Business profile updated!");
    // onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Company name */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">
          Company Name
        </Label>
        <Input
          {...register("companyName")}
          placeholder="e.g. Acme Inc."
          disabled={isPending}
        />
      </div>

      {/* Business Model */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">
          Business Model
        </Label>
        <Popover open={businessModelOpen} onOpenChange={setBusinessModelOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              disabled={isPending}
              className="w-full justify-between font-normal"
            >
              <span className={cn(!businessModel && "text-muted-foreground")}>
                {businessModel || "Select a model"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandList>
                <CommandGroup>
                  {BUSINESS_MODELS.map((m) => (
                    <CommandItem
                      key={m}
                      value={m}
                      onSelect={() => {
                        setValue("businessModel", m);
                        setBusinessModelOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          businessModel === m ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {m}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Company Stage */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">
          Company Stage
        </Label>
        <Popover open={companyStageOpen} onOpenChange={setCompanyStageOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              disabled={isPending}
              className="w-full justify-between font-normal"
            >
              <span className={cn(!companyStage && "text-muted-foreground")}>
                {companyStage || "Select stage"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandList>
                <CommandGroup>
                  {COMPANY_STAGES.map((s) => (
                    <CommandItem
                      key={s}
                      value={s}
                      onSelect={() => {
                        setValue("companyStage", s);
                        setCompanyStageOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          companyStage === s ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {s}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Elevator Pitch */}
      <div>
        <Label className="text-gray-700 mb-1.5 block text-sm">
          Elevator Pitch{" "}
          <span className="text-gray-400 font-normal text-xs">
            (one sentence)
          </span>
        </Label>
        <textarea
          className="flex min-h-[64px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          rows={2}
          {...register("elevatorPitch")}
          disabled={isPending}
          placeholder="We help African SMEs access affordable trade finance through a mobile-first platform."
        />
      </div>

      {/* Offers */}
      <TagSelector
        tags={OFFER_TAGS}
        selected={offers}
        onToggle={handleToggleOffer}
        max={3}
        label="What can you offer?"
        description="Skills and experience you can share with fellow alumni."
      />

      {/* Needs */}
      <TagSelector
        tags={NEED_TAGS}
        selected={needs}
        onToggle={handleToggleNeed}
        max={3}
        label="What are you looking for?"
        description="Areas where you'd welcome support from the network."
      />

      {/* Visibility */}
      <div className="border-t pt-4">
        <Label className="text-gray-700 mb-3 block text-sm">
          Contact Visibility
        </Label>
        <div className="space-y-2">
          {VISIBILITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                visibility === opt.value
                  ? "border-[#155DFC] bg-[#155DFC]/5"
                  : "border-gray-200 hover:border-gray-300 bg-white",
              )}
            >
              <input
                type="radio"
                name="visibility"
                value={opt.value}
                checked={visibility === opt.value}
                onChange={() => setValue("visibility", opt.value)}
                className="mt-0.5 accent-[#155DFC]"
                disabled={isPending}
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-500">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onDone}
          className="flex-1"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
