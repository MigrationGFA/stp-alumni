"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Upload, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

/**
 * Resources page - Educational and professional resources
 * @returns {JSX.Element}
 */
export default function ResourcesPage() {
  const t = useTranslations("Resources");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  return (
    <div className="">
      {/* Title */}
      <h1 className="text-2xl lg:text-3xl font-bold text-stp-blue-light mb-6">{t("title")}</h1>

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-10 h-12 w-full bg-transparent border border-[#233389] focus:border-[#233389] focus:ring-0 focus-visible:ring-0 rounded-lg"
          />
        </div>
        <div className="flex gap-3">
          <Button className="bg-stp-blue-light hover:bg-stp-blue-light/90 text-white h-12 px-6">
            <Upload className="h-5 w-5 mr-2" />
            {t("uploadResources")}
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 border-gray-300">
            <Filter className="h-5 w-5 text-gray-600" />
          </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
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
                <Button
                  variant="outline"
                  size="sm"
                  className="border-stp-blue-light text-stp-blue-light hover:bg-stp-blue-light hover:text-white"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {t("download")}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
