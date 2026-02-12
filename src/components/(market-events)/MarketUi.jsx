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
import { alumniProfiles } from "@/lib/data";
import { usePathname } from "@/i18n/routing";
import Container from "../container";

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
    const sectorMap = {
      it: "IT sector",
      healthcare: "Healthcare",
      finance: "Finance",
      education: "Education",
    };
    return sectorMap[sector] || sector;
  };

  const filteredAlumni = useMemo(() => {
    return alumniProfiles.filter((alumni) => {
      const matchesSearch =
        !filters.search ||
        alumni.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        t(alumni.roleKey).toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole =
        filters.role === "all" || alumni.role === filters.role;
      const matchesSector =
        filters.sector === "all" || alumni.sector === filters.sector;

      return matchesSearch && matchesRole && matchesSector;
    });
  }, [filters, t]);

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
            data={filteredAlumni}
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
              data={filteredAlumni}
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

      <div className="bg-white rounded-lg p-6">
        {data.length > 0 ? (
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
  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
    <div className="relative w-full aspect-square">
      <Image
        src={alumni.image}
        alt={alumni.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4 text-center">
      <h3 className="text-lg font-bold text-gray-900">{alumni.name}</h3>
      <p className="text-sm text-gray-600">
        {t(alumni.roleKey)} | {getSectorDisplay(alumni.sector)}
      </p>
      <p className="text-xs text-gray-500 mt-1">{t(alumni.educationKey)}</p>
      <Button
        variant="outline"
        className="w-full mt-4 border-[#233389] text-[#233389] rounded-full"
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
