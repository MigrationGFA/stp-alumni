'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'fr' ? 'en' : 'fr';
    // router.replace keeps the user on the current page but swaps the prefix
    router.replace(pathname, { locale: nextLocale });
  };

  console.log(locale)

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="font-medium"
    >
      {locale === 'fr' ? '🇺🇸 EN' : '🇫🇷 FR'}
    </Button>
  );
}