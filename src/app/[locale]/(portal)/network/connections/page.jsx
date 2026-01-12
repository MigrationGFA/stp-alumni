"use client";
// remeber to lazy load renderContent componets
import { useState } from "react";
import { InvitationsList } from "../(components)/InvitationsList";
import { NetworkStats } from "../(components)/NetworkStats";
import { PeopleSuggestions } from "../(components)/PeopleSuggestions";
import { ConnectionsContent } from "../(components)/ConnectionsContent";
import { GroupsContent } from "../(components)/GroupsContent";
import { EventsContent } from "../(components)/EventsContent";
import { NetworkSearch } from "../(components)/NetworkSearch";
import { PeopleConnection } from "../(components)/PeopleConnection";

const Page = () => {
  

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
