import { useState } from "react";
import { Input } from "@/components/ui/input";

export function NetworkSearch({ search, setSearch }) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search and connect with your network..."
          className="pr-10 bg-transparent border-[#233389]/50"
        />
      </div>
    </div>
  );
}
