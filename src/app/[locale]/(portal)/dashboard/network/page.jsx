// import { redirect } from "next/navigation";
// import { getLocale } from "next-intl/server";

// export default async function NetworkEntryPage() {
//   const locale = await getLocale();

//   // Hard-coding the redirect path with the locale 
//   // prevents the "undefined" error caused by the library's internal resolver
//   redirect(`/${locale}/dashboard/network/connections`);
// }

"use client";
// remeber to lazy load renderContent componets
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";
import useNetworkStore from "@/lib/store/useNetworkStore";
import { InvitationsList } from "./(components)/InvitationsList";
import { PeopleSuggestions } from "./(components)/PeopleSuggestions";
import { ConnectionsContent } from "./(components)/ConnectionsContent";
import { NetworkSearch } from "./(components)/NetworkSearch";
import { PeopleConnection } from "./(components)/PeopleConnection";

const Page = () => {
  const { setNetworkData, setLoading, setError } = useNetworkStore();

  // Fetch all custom lists (networkUsers, sameSkillUsers, sameSectorUsers, connections)
  const { data: networkPayload, isLoading: isNetworkLoading, error: networkError } = useQuery({
    queryKey: ["network"],
    queryFn: () => networkService.getNetwork(),
    staleTime: 5 * 60 * 1000,
  });

  // Sync React Query state to Zustand
  useEffect(() => {
    setLoading(isNetworkLoading);
    if (networkError) setError(networkError);

    if (networkPayload?.data) {
      setNetworkData(networkPayload?.data);
    }
  }, [
    networkPayload,
    isNetworkLoading,
    networkError,
    setNetworkData,
    setLoading,
    setError
  ]);

  console.log("Network payload:", networkPayload);

  return (
    <>
      <NetworkSearch />
      <InvitationsList />
      <ConnectionsContent />
      <PeopleSuggestions />
      <PeopleConnection />
    </>
  );
};

export default Page;
