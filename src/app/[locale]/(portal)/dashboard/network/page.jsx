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
import { InvitationsList } from "./(components)/InvitationsList";
import { PeopleSuggestions } from "./(components)/PeopleSuggestions";
import { ConnectionsContent } from "./(components)/ConnectionsContent";
import { NetworkSearch } from "./(components)/NetworkSearch";
import { PeopleConnection } from "./(components)/PeopleConnection";

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
