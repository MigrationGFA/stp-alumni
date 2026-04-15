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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";
import useNetworkStore from "@/lib/store/useNetworkStore";
import { InvitationsList } from "./(components)/InvitationsList";
import { ConnectionsContent } from "./(components)/ConnectionsContent";
import { NetworkSearch } from "./(components)/NetworkSearch";
// import { PeopleSuggestions } from "./(components)/PeopleSuggestions";
// import { PeopleConnection } from "./(components)/PeopleConnection";

const Page = () => {
  const { setNetworkData, setLoading, setError } = useNetworkStore();

  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState("all");
  const [activeTab, setActiveTab] = useState("network");

  // Fetch all custom lists (networkUsers, sameSkillUsers, sameSectorUsers, connections)
  const {
    data: networkPayload,
    isLoading: isNetworkLoading,
    error: networkError,
  } = useQuery({
    queryKey: ["network"],
    queryFn: () => networkService.getNetwork(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: invitationsData, isLoading } = useQuery({
    queryKey: ["invitations"],
    queryFn: networkService.getIncomingRequests,
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
    setError,
  ]);

  const network = networkPayload?.data;
  const invitations = invitationsData?.data;

  const fillteredData = useMemo(() => {
    const data = activeTab === "network" ? network : invitations;

    return data?.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase());

        const matchesSector =
          activeSector === "all" ||
          user.sector.includes(activeSector)

      return matchesSearch && matchesSector;
    });
  }, [network, invitations, search, activeTab,activeSector]);

  const uniqueSectors = [
    ...new Set(network?.flatMap((item) => item.sector || [])),
  ];

  console.log("Network payload:", activeSector);

  return (
    <>
      <NetworkSearch search={search} setSearch={setSearch} />

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList variant="line" className="">
          <TabsTrigger value="network" onClick={() => setActiveTab("network")}>
            Network
          </TabsTrigger>
          <TabsTrigger
            value="invitation"
            onClick={() => setActiveTab("invitation")}
          >
            Invitation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="network">
          <ConnectionsContent
            displayList={fillteredData}
            activeSector={activeSector}
            uniqueSectors={uniqueSectors}
            setActiveSector={setActiveSector}
          />
        </TabsContent>

        <TabsContent value="invitation">
          <InvitationsList invitations={invitations} isLoading={isLoading}/>
        </TabsContent>
      </Tabs>
      {/* <PeopleSuggestions />
      <PeopleConnection /> */}
    </>
  );
};

export default Page;
