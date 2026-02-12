import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export default async function NetworkEntryPage() {
  const locale = await getLocale();
  
  // Hard-coding the redirect path with the locale 
  // prevents the "undefined" error caused by the library's internal resolver
  redirect(`/${locale}/network/connections`);
}