import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Consulting",
];

const locations = [
  "Lagos, Nigeria",
  "Abuja, Nigeria",
  "London, UK",
  "New York, USA",
  "Remote",
];

export function NetworkSearch({search,setSearch}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    industry: "",
    location: "",
    connectionDegree: [],
  });

  const activeFiltersCount = [
    filters.industry,
    filters.location,
    ...filters.connectionDegree,
  ].filter(Boolean).length;

  const handleConnectionDegreeChange = (degree, checked) => {
    setFilters((prev) => ({
      ...prev,
      connectionDegree: checked
        ? [...prev.connectionDegree, degree]
        : prev.connectionDegree.filter((d) => d !== degree),
    }));
  };

  const clearFilters = () => {
    setFilters({
      industry: "",
      location: "",
      connectionDegree: [],
    });
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="search"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search and connect with your network..."
          className="pr-10 bg-transparent border-[#233389]/50"
        />
        {/* <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
        >
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button> */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            {/* <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button> */}
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Industry</Label>
                <Select
                  value={filters.industry}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, industry: value }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Location</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, location: value }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Connection Degree */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Connection Degree
                </Label>
                <div className="space-y-2">
                  {["1st", "2nd", "3rd+"].map((degree) => (
                    <div key={degree} className="flex items-center gap-2">
                      <Checkbox
                        id={`degree-${degree}`}
                        checked={filters.connectionDegree.includes(degree)}
                        onCheckedChange={(checked) =>
                          handleConnectionDegreeChange(degree, checked)
                        }
                      />
                      <Label
                        htmlFor={`degree-${degree}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {degree} connections
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply button */}
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* <Button className="bg-stp-blue-light hover:bg-primary/90 px-6">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button> */}
    </div>
  );
}
