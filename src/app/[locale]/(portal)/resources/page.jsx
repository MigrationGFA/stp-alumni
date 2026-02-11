"use client";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, Upload, Filter, Download, X, FileText, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

/**
 * Resources page - Educational and professional resources
 * @returns {JSX.Element}
 */
export default function ResourcesPage() {
  const t = useTranslations("Resources");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "",
    file: null,
  });
  const [filters, setFilters] = useState({
    fileTypes: [],
    sortBy: "newest",
  });

  const categories = [
    { id: "all", label: t("all"), count: null },
    { id: "guides", label: t("guides"), count: 1 },
    { id: "trainingMaterials", label: t("trainingMaterials"), count: 4 },
    { id: "templates", label: t("templates"), count: 8 },
    { id: "policies", label: t("policies"), count: 3 },
    { id: "sharedDocs", label: t("sharedDocs"), count: 2 },
    { id: "videos", label: t("videos"), count: 0 },
  ];

  const resources = [
    {
      id: 1,
      title: t("resource1Title"),
      description: t("resource1Desc"),
      category: "guides",
      fileType: "PDF",
      author: t("authorName"),
      date: 3,
      iconColor: "bg-blue-500",
    },
    {
      id: 2,
      title: t("resource2Title"),
      description: t("resource2Desc"),
      category: "policies",
      fileType: "PDF",
      author: t("authorName"),
      date: 2,
      iconColor: "bg-blue-500",
    },
    {
      id: 3,
      title: t("resource3Title"),
      description: t("resource3Desc"),
      category: "templates",
      fileType: "XLS",
      author: t("authorName"),
      date: 3,
      iconColor: "bg-green-500",
    },
    {
      id: 4,
      title: t("resource4Title"),
      description: t("resource4Desc"),
      category: "guides",
      fileType: "DOC",
      author: t("authorName"),
      date: 2,
      iconColor: "bg-blue-600",
    },
    {
      id: 5,
      title: t("resource5Title"),
      description: t("resource5Desc"),
      category: "templates",
      fileType: "DOC",
      author: t("authorName"),
      date: 3,
      iconColor: "bg-blue-600",
    },
    {
      id: 6,
      title: t("resource6Title"),
      description: t("resource6Desc"),
      category: "trainingMaterials",
      fileType: "PPT",
      author: t("authorName"),
      date: 2,
      iconColor: "bg-red-500",
    },
  ];

  const getFileTypeDisplay = (fileType) => {
    return fileType;
  };

  const getCategoryLabel = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.label : categoryId;
  };

  // Filter resources based on search, category, and advanced filters
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((resource) => resource.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          getCategoryLabel(resource.category).toLowerCase().includes(query)
      );
    }

    // Filter by file types
    if (filters.fileTypes.length > 0) {
      filtered = filtered.filter((resource) =>
        filters.fileTypes.includes(resource.fileType)
      );
    }

    // Sort resources
    const sorted = [...filtered];
    switch (filters.sortBy) {
      case "newest":
        sorted.sort((a, b) => a.date - b.date);
        break;
      case "oldest":
        sorted.sort((a, b) => b.date - a.date);
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return sorted;
  }, [resources, selectedCategory, searchQuery, filters]);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    // Handle file upload logic here
    console.log("Upload form:", uploadForm);
    // Reset form and close dialog
    setUploadForm({ title: "", description: "", category: "", file: null });
    setIsUploadOpen(false);
    // You can add API call here to upload the resource
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({ ...uploadForm, file });
    }
  };

  const toggleFileType = (fileType) => {
    setFilters((prev) => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(fileType)
        ? prev.fileTypes.filter((type) => type !== fileType)
        : [...prev.fileTypes, fileType],
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setFilters({
      fileTypes: [],
      sortBy: "newest",
    });
  };

  const hasActiveFilters = 
    searchQuery !== "" || 
    selectedCategory !== "all" || 
    filters.fileTypes.length > 0 || 
    filters.sortBy !== "newest";

  const fileTypes = ["PDF", "DOC", "XLS", "PPT"];

  return (
    <div className="p-3 sm:p-0">
      {/* Title */}
      <h1 className="text-2xl lg:text-3xl font-bold text-stp-blue-light mb-6">{t("title")}</h1>

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 w-full bg-transparent border border-[#233389] focus:border-[#233389] focus:ring-0 focus-visible:ring-0 rounded-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-stp-blue-light hover:bg-stp-blue-light/90 text-white h-12 px-6">
                <Upload className="h-5 w-5 mr-2" />
                {t("uploadResources")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Upload Resource</DialogTitle>
                <DialogDescription>
                  Share educational materials, templates, and documents with the community.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="Enter resource title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    placeholder="Describe the resource"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={uploadForm.category}
                    onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guides">Guides</SelectItem>
                      <SelectItem value="trainingMaterials">Training Materials</SelectItem>
                      <SelectItem value="templates">Templates</SelectItem>
                      <SelectItem value="policies">Policies</SelectItem>
                      <SelectItem value="sharedDocs">Shared Docs</SelectItem>
                      <SelectItem value="videos">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      required
                      className="cursor-pointer"
                    />
                    {uploadForm.file && (
                      <span className="text-sm text-gray-600">{uploadForm.file.name}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUploadOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-stp-blue-light hover:bg-stp-blue-light/90">
                    Upload Resource
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 border-gray-300 relative ${
                  hasActiveFilters ? "border-stp-blue-light" : ""
                }`}
                title="Advanced filters"
              >
                <Filter className={`h-5 w-5 ${hasActiveFilters ? "text-stp-blue-light" : "text-gray-600"}`} />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-stp-blue-light rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Advanced Filters
                  </h4>
                </div>

                <Separator />

                {/* File Type Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">File Type</Label>
                  <div className="space-y-2">
                    {fileTypes.map((fileType) => (
                      <div key={fileType} className="flex items-center space-x-2">
                        <Checkbox
                          id={`file-${fileType}`}
                          checked={filters.fileTypes.includes(fileType)}
                          onCheckedChange={() => toggleFileType(fileType)}
                        />
                        <label
                          htmlFor={`file-${fileType}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {fileType} Files
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Sort By */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, sortBy: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title">Title (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 bg-stp-blue-light hover:bg-stp-blue-light/90"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`h-11 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-[#233389] ${
              selectedCategory === category.id
                ? "bg-[#233389] text-white"
                : "bg-transparent text-gray-700 hover:bg-gray-50"
            }`}
          >
            {category.label}
            {category.count !== null && ` (${category.count})`}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="p-6 hover:shadow-md transition-shadow bg-white">
              <div className="flex flex-col h-full">
                {/* File Type Icon and Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`${resource.iconColor} w-12 h-12 rounded flex items-center justify-center shrink-0`}>
                    <span className="text-white font-semibold text-sm">
                      {getFileTypeDisplay(resource.fileType)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight">
                      {resource.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                  {resource.description}
                </p>

                {/* Category Badge */}
                <div className="mb-4">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5"
                  >
                    {getCategoryLabel(resource.category)}
                  </Badge>
                </div>

                {/* Author, Date, and Download Button */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/assets/Profile Image.jpg" alt={resource.author} />
                      <AvatarFallback>{resource.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{resource.author}</p>
                      <p className="text-xs text-gray-500">
                        {resource.date === 1 
                          ? t("dayAgo") 
                          : resource.date === 2
                          ? t("2daysAgo")
                          : t("3daysAgo")
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-1.5 px-3 h-8 rounded-md text-sm font-medium border border-[#233389] bg-white text-[#233389] hover:bg-[#233389] hover:text-white transition-colors duration-200"
                  >
                    <Download className="h-4 w-4" />
                    {t("download")}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
          <p className="text-sm text-gray-500 max-w-md">
            {searchQuery
              ? "Try adjusting your search query or filters to find what you're looking for."
              : "No resources available in this category."}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={clearAllFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
