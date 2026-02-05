"use client";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Search, Users } from "lucide-react";
import { useAuthView } from "@/contexts/AuthViewContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Marketplace page - Connect with alumni professionals
 * @returns {JSX.Element}
 */
export default function MarketplacePage() {
  const t = useTranslations("Marketplace");
  const { isPublicView } = useAuthView();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Sample alumni data
  const alumniProfiles = [
    {
      id: 1,
      name: "Ajiboye Opeyemi",
      role: "developer",
      sector: "it",
      roleKey: "roleDeveloper",
      educationKey: "educationPhD",
      experienceKey: "experience10",
      image: "/assets/Marketplace 1.jpg",
    },
    {
      id: 2,
      name: "Daniel Adeniran",
      role: "designer",
      sector: "healthcare",
      roleKey: "roleDesigner",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 2.jpg",
    },
    {
      id: 3,
      name: "Wale Adedayo",
      role: "developer",
      sector: "finance",
      roleKey: "roleDeveloper",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 3.jpg",
    },
    {
      id: 4,
      name: "Chioma Okonkwo",
      role: "manager",
      sector: "education",
      roleKey: "roleManager",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 4.jpg",
    },
    {
      id: 5,
      name: "Ajiboye Opeyemi",
      role: "developer",
      sector: "it",
      roleKey: "roleDeveloper",
      educationKey: "educationPhD",
      experienceKey: "experience10",
      image: "/assets/Marketplace 1.jpg",
    },
    {
      id: 6,
      name: "Daniel Adeniran",
      role: "designer",
      sector: "healthcare",
      roleKey: "roleDesigner",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 2.jpg",
    },
    {
      id: 7,
      name: "Wale Adedayo",
      role: "developer",
      sector: "finance",
      roleKey: "roleDeveloper",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 3.jpg",
    },
    {
      id: 8,
      name: "Chioma Okonkwo",
      role: "manager",
      sector: "education",
      roleKey: "roleManager",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 4.jpg",
    },
  ];

  // Helper function to get sector display name
  const getSectorDisplay = (sector) => {
    const sectorMap = {
      it: "IT sector",
      healthcare: "Healthcare",
      finance: "Finance",
      education: "Education",
    };
    return sectorMap[sector] || sector;
  };

  // Filter alumni based on search and filters
  const filteredAlumni = useMemo(() => {
    let filtered = alumniProfiles;

    // Filter by search query (name, role, or sector)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (alumni) =>
          alumni.name.toLowerCase().includes(query) ||
          t(alumni.roleKey).toLowerCase().includes(query) ||
          getSectorDisplay(alumni.sector).toLowerCase().includes(query)
      );
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((alumni) => alumni.role === roleFilter);
    }

    // Filter by sector
    if (sectorFilter !== "all") {
      filtered = filtered.filter((alumni) => alumni.sector === sectorFilter);
    }

    return filtered;
  }, [alumniProfiles, searchQuery, roleFilter, sectorFilter, t]);

  return (
    <div className="min-h-screen p-3 sm:p-0">
      {/* Page Title: only when inside portal (registered) layout */}
      {!isPublicView && (
        <h1 className="text-3xl font-bold text-[#233389] mb-6">{t("title")}</h1>
      )}

      {/* Search and Filters Section */}
      <div className="mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 w-full bg-transparent border border-[#233389] focus:border-[#233389] focus:ring-0 focus-visible:ring-0 rounded-lg"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-end gap-6">
          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("role")}
            </label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-fit h-11 border border-[#233389] rounded-md bg-transparent px-3 py-2 text-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("roleAll")}</SelectItem>
                <SelectItem value="developer">{t("roleDeveloper")}</SelectItem>
                <SelectItem value="designer">{t("roleDesigner")}</SelectItem>
                <SelectItem value="manager">{t("roleManager")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sector/Industry Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("sectorIndustry")}
            </label>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-fit h-11 border border-[#233389] rounded-md bg-transparent px-3 py-2 text-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("sectorAll")}</SelectItem>
                <SelectItem value="healthcare">{t("sectorHealthcare")}</SelectItem>
                <SelectItem value="it">{t("sectorIT")}</SelectItem>
                <SelectItem value="finance">{t("sectorFinance")}</SelectItem>
                <SelectItem value="education">{t("sectorEducation")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("location")}
            </label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-fit h-11 border border-[#233389] rounded-md bg-transparent px-3 py-2 text-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("locationAll")}</SelectItem>
                <SelectItem value="nearme">{t("locationNearMe")}</SelectItem>
                <SelectItem value="lagos">{t("locationLagos")}</SelectItem>
                <SelectItem value="abuja">{t("locationAbuja")}</SelectItem>
                <SelectItem value="london">{t("locationLondon")}</SelectItem>
                <SelectItem value="newyork">{t("locationNewYork")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="bg-white rounded-lg p-6">
        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlumni.map((alumni) => (
            <div
              key={alumni.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Profile Image */}
              <div className="relative w-full aspect-square">
                <Image
                  src={alumni.image}
                  alt={alumni.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>

              {/* Profile Info */}
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {alumni.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {t(alumni.roleKey)} | {getSectorDisplay(alumni.sector)}
                </p>
                <p className="text-xs text-gray-500 mb-1">{t(alumni.educationKey)}</p>
                <p className="text-xs text-gray-500 mb-4">{t(alumni.experienceKey)}</p>

                {/* Contact Button */}
                <Button
                  variant="outline"
                  className="w-full border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white rounded-full"
                >
                  {t("contact")}
                </Button>
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No alumni found</h3>
            <p className="text-sm text-gray-500 max-w-md mb-4">
              {searchQuery
                ? "Try adjusting your search query or filters to find alumni."
                : "No alumni match the selected filters."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setSectorFilter("all");
              }}
              className="border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
