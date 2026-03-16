"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Link, LogOut } from "lucide-react";
import { Link as NavLink } from '@/i18n/routing';

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

const groups = [
  {
    id: 1,
    name: "STP Alumni Network",
    members: 1250,
    isPublic: true,
    description: "Official community for STP program alumni worldwide",
    cover:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Tech Founders Circle",
    members: 456,
    isPublic: false,
    description: "Exclusive group for tech startup founders and entrepreneurs",
    cover:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Product Managers Hub",
    members: 892,
    isPublic: true,
    description: "Community for product managers to share insights and learn",
    cover:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Design System Community",
    members: 634,
    isPublic: true,
    description: "Collaborate on design principles and UI/UX best practices",
    cover:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop",
  },
  {
    id: 5,
    name: "Data Science Collective",
    members: 789,
    isPublic: true,
    description: "Share data science projects, algorithms, and insights",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
  }
];

export function GroupsContent() {
  const itemsPerPage = 4; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the indices for slicing the array
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the groups array to only show the current page's items
  const currentGroups = groups.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(groups.length / itemsPerPage);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-[#020618] font-semibold">
            My Groups
          </CardTitle>

          <div className="flex items-center bg-transparent">
            <p className="text-sm text-[#020618]/50 font-light">Sort by:</p>
            <Select>
              <SelectTrigger className="w-40 text-[#020618]/50 text-sm">
                <SelectValue placeholder="Recently Added" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort</SelectLabel>
                  <SelectItem value="val">Apple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="rounded-lg overflow-hidden hover:shadow-card-hover transition- flex items-center justify-between"
              >
                <div className="flex gap-2 items-center">
                  <div className="relative h-15 w-15 rounded-lg bg-white/50 overflow-hidden  shadow-sm">
                    <Image
                      src={group.cover}
                      alt="Group Cover"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <NavLink href={`/dashboard/groups/${group.id}`} className="hover:underline">
                    <p className="text-sm font-medium truncate">{group.name}</p>
                    </NavLink>
                    <p className="text-xs text-muted-foreground truncate">
                      {group.members} members
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link className="h-4 w-4 mr-2" />
                      Copy link to group
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="h-4 w-4 mr-2" />
                      Leave this group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-[#020618] font-semibold">Groups</CardTitle>

          <div className="flex items-center bg-transparent">
            <p className="text-sm text-[#020618]/50 font-light">Sort by:</p>
            <Select>
              <SelectTrigger className="w-25 text-[#020618]/50 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort</SelectLabel>
                  <SelectItem value="val">Apple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {currentGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-lg overflow-hidden hover:shadow-card-hover transition- flex items-center justify-between"
              >
                <div className="flex gap-2 items-center">
                  <div className="relative h-15 w-15 rounded-lg bg-white/50 overflow-hidden  shadow-sm">
                    <Image
                      src={group.cover}
                      alt="Group Cover"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <NavLink href={`/dashboard/groups/${group.id}`} className="hover:underline">

                    <p className="text-sm font-medium truncate">{group.name}</p>
                    </NavLink>
                    <p className="text-xs text-muted-foreground truncate">
                      {group.members} members &bull;{" "}
                      {group.isPublic ? "Public" : "Private"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {group.description}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-stp-blue-light rounded-2xl text-stp-blue-light hover:bg-accent hover:text-accent-foreground"
                >
                  {/* <MessageCircle className="h-4 w-4 mr-1" /> */}
                  <span className="hidden sm:inline">Join</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Update Pagination logic */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage((v) => v - 1);
              }}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {/* Always show page 1 */}
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 1}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {/* Show ellipsis if current page is far from the start */}
          {currentPage > 3 && totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Show a range of pages around the current page */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page !== 1 &&
                page !== totalPages &&
                Math.abs(page - currentPage) <= 1
            )
            .map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

          {/* Show ellipsis if current page is far from the end */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Always show the last page (if it's not page 1) */}
          {totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentPage === totalPages}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage((v) => v + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
