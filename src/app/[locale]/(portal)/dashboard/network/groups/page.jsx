"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import groupService from "@/lib/services/groupService";
import { useGroupStore } from "@/lib/store/useGroupStore";
import { GroupsContent } from "../(components)/GroupsContent";

function Page() {
  const { setGroups, setLoading, setError } = useGroupStore();

  const { data: groupsData, isLoading, error } = useQuery({
    queryKey: ['groups'],
    queryFn: groupService.getGroups,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setLoading(isLoading);
    if (error) {
      setError(error.message);
    }
    if (groupsData?.data) {
      setGroups(groupsData.data);
    }
  }, [groupsData, isLoading, error, setGroups, setLoading, setError]);

  return (
    <>
      <GroupsContent />
    </>
  );
}

export default Page;
