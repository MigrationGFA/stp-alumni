"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("healthcare");
  const [locationFilter, setLocationFilter] = useState("nearme");

  // Sample alumni data
  const alumniProfiles = [
    {
      id: 1,
      name: "Ajiboye Opeyemi",
      roleKey: "roleIT",
      educationKey: "educationPhD",
      experienceKey: "experience10",
      image: "/assets/Marketplace 1.jpg",
    },
    {
      id: 2,
      name: "Daniel Adeniran",
      roleKey: "roleDesigner",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 2.jpg",
    },
    {
      id: 3,
      name: "Wale Adedayo",
      roleKey: "roleIT",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 3.jpg",
    },
    {
      id: 4,
      name: "Wale Adedayo",
      roleKey: "roleIT",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 4.jpg",
    },
    {
      id: 5,
      name: "Ajiboye Opeyemi",
      roleKey: "roleIT",
      educationKey: "educationPhD",
      experienceKey: "experience10",
      image: "/assets/Marketplace 1.jpg",
    },
    {
      id: 6,
      name: "Daniel Adeniran",
      roleKey: "roleDesigner",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 2.jpg",
    },
    {
      id: 7,
      name: "Wale Adedayo",
      roleKey: "roleIT",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 3.jpg",
    },
    {
      id: 8,
      name: "Wale Adedayo",
      roleKey: "roleIT",
      educationKey: "educationMSc",
      experienceKey: "experience5",
      image: "/assets/Marketplace 4.jpg",
    },
  ];

  return (
    <div className="min-h-screen px-3 sm:p-0">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-[#233389] mb-6">{t("title")}</h1>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {alumniProfiles.map((alumni) => (
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
              <p className="text-sm text-gray-600 mb-1">{t(alumni.roleKey)}</p>
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
      </div>
    </div>
  );
}
