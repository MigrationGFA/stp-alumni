"use client";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePathname } from "@/i18n/routing";
import Container from "../container";
import { useQuery } from "@tanstack/react-query";
import publicService from "@/lib/services/publicService";

export default function MarketplaceUi() {
  const t = useTranslations("Marketplace");
  const {
    size: { height },
  } = useNavbar();
  const pathname = usePathname();

  const isShow = pathname.includes("dashboard");
  // console.log(isShow, "lol");

  // 1. Group State to reduce "prop soup"
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    sector: "all",
    location: "all",
  });

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const getSectorDisplay = (sector) => {
    if (!sector) return "";
    const sectorMap = {
      it: "IT sector",
      healthcare: "Healthcare",
      finance: "Finance",
      education: "Education",
    };
    return sectorMap[sector.toLowerCase()] || sector;
  };

  const { data: marketplaceData, isLoading } = useQuery({
    queryKey: ["marketplace", filters],
    queryFn: () => {
      const params = {};

      if (filters.search && filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.sector && filters.sector !== "all") {
        // e.g., mapping "finance" back to what the backend expects, or passing it directly.
        params.sector = filters.sector;
      }

      if (filters.location && filters.location !== "all") {
        params.location = filters.location;
      }

      if (filters.role && filters.role !== "all") {
        params.role = filters.role;
      }

      return publicService.getMarketplace(params);
    },
  });

  const apiAlumni = marketplaceData?.data || Array.isArray(marketplaceData) ? marketplaceData : [];

  return (
    <div
      className="min-h-screen p-3 sm:p-0"
      style={{ marginTop: `${height}px` }}
    >
      {isShow ? (
        <>
          <h1 className="text-3xl font-bold text-[#233389] mb-6">
            {t("title")}
          </h1>

          {/* 2. Passing just 3 props instead of 7 */}
          <MarketplaceContent
            t={t}
            filters={filters}
            updateFilter={updateFilter}
            data={apiAlumni}
            isLoading={isLoading}
            getSectorDisplay={getSectorDisplay}
          />
        </>
      ) : (
        <>
          <div className="bg-linear-to-l from-[#1B2F5B] to-[#3964C1] p-7 mb-5">
            <h1 className="text-2xl lg:text-3xl font-bold text-white text-center ">
              {t("title")}
            </h1>
          </div>
          <Container className=" mx-auto space-y-6">
            <MarketplaceContent
              t={t}
              filters={filters}
              updateFilter={updateFilter}
              data={apiAlumni}
              isLoading={isLoading}
              getSectorDisplay={getSectorDisplay}
            />
          </Container>
        </>
      )}
    </div>
  );
}

function MarketplaceContent({
  t,
  filters,
  updateFilter,
  data,
  isLoading,
  getSectorDisplay,
}) {
  return (
    <>
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 h-12 w-full bg-transparent border border-[#233389] rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-end gap-6">
          <FilterSelect
            label={t("role")}
            value={filters.role}
            onValueChange={(v) => updateFilter("role", v)}
          >
            <SelectItem value="all">{t("roleAll")}</SelectItem>
            <SelectItem value="developer">{t("roleDeveloper")}</SelectItem>
            <SelectItem value="designer">{t("roleDesigner")}</SelectItem>
            <SelectItem value="manager">{t("roleManager")}</SelectItem>
          </FilterSelect>

          <FilterSelect
            label={t("sectorIndustry")}
            value={filters.sector}
            onValueChange={(v) => updateFilter("sector", v)}
          >
            <SelectItem value="all">{t("sectorAll")}</SelectItem>
            <SelectItem value="it">{t("sectorIT")}</SelectItem>
            <SelectItem value="healthcare">{t("sectorHealthcare")}</SelectItem>
            <SelectItem value="finance">{t("sectorFinance")}</SelectItem>
          </FilterSelect>

          <FilterSelect
            label={t("location")}
            value={filters.location}
            onValueChange={(v) => updateFilter("location", v)}
          >
            <SelectItem value="all">{t("locationAll")}</SelectItem>
            <SelectItem value="lagos">{t("locationLagos")}</SelectItem>
            <SelectItem value="abuja">{t("locationAbuja")}</SelectItem>
          </FilterSelect>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#233389]"></div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((alumni) => (
              <AlumniCard
                key={alumni.id}
                alumni={alumni}
                t={t}
                getSectorDisplay={getSectorDisplay}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            onClear={() => {
              updateFilter("search", "");
              updateFilter("role", "all");
              updateFilter("sector", "all");
              updateFilter("location", "all");
            }}
          />
        )}
      </div>
    </>
  );
}

// --- Minimalist Sub-components to keep things "Chop Chop" ---

const FilterSelect = ({ label, value, onValueChange, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-fit h-11 border border-[#233389] rounded-md px-3 text-gray-700">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  </div>
);

const AlumniCard = ({ alumni, t, getSectorDisplay }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border flex flex-col items-center p-6 text-center">
    <div className="relative w-24 h-24 mb-4">
      <Image
        src={alumni.profileImage || alumni.image || "/assets/Profile Image.jpg"}
        alt={alumni.name || "Alumni"}
        fill
        className="object-cover rounded-full border border-gray-200"
      />
    </div>
    <div className="w-full">
      <h3 className="text-lg font-bold text-gray-900">{alumni.name || "Anonymous Member"}</h3>
      <p className="text-sm text-gray-600 font-medium">
        {(alumni.roleKey ? t(alumni.roleKey) : alumni.role) || "Member"} | {getSectorDisplay(alumni.sector) || "General Sector"}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        {alumni.educationKey ? t(alumni.educationKey) : (alumni.education || "STP Alumni")}
      </p>
      <div className="text-xs text-gray-500 mt-1 flex justify-center gap-1 font-medium bg-gray-50 py-1 rounded-md">
        {alumni.location || "Location Not Set"}
      </div>
      <Button
        variant="outline"
        className="w-full mt-5 border-[#233389] text-[#233389] rounded-full hover:bg-blue-50"
      >
        {t("contact")}
      </Button>
    </div>
  </div>
);

const EmptyState = ({ onClear }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Users className="h-16 w-16 text-gray-300 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900">No alumni found</h3>
    <Button
      onClick={onClear}
      variant="outline"
      className="mt-4 border-[#233389] text-[#233389]"
    >
      Clear all filters
    </Button>
  </div>
);
