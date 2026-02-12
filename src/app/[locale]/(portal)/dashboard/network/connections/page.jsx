"use client";
// remeber to lazy load renderContent componets
import { InvitationsList } from "../(components)/InvitationsList";
import { PeopleSuggestions } from "../(components)/PeopleSuggestions";
import { ConnectionsContent } from "../(components)/ConnectionsContent";
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
