

import { Bell, Check, Globe, Palette } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Toggle } from './page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

function PreferencesTab() {
 const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'fr' ? 'en' : 'fr';
    // router.replace keeps the user on the current page but swaps the prefix
    router.replace(pathname, { locale: nextLocale });
  };


  // Theme
  const { theme, setTheme } = useTheme()

  // Notifications
  const [notifNewPost, setNotifNewPost] = useState(true);
  const [notifMentions, setNotifMentions] = useState(true);
  const [notifMessages, setNotifMessages] = useState(false);
  const [notifDigest, setNotifDigest] = useState(true);
  const [notifMarketplace, setNotifMarketplace] = useState(true);

  // TODO: wire all handlers to a preferences API endpoint or localStorage
  const handleSavePreferences = () => {
    const payload = {
      language,
      theme,
      notifications: {
        newPost: notifNewPost,
        mentions: notifMentions,
        messages: notifMessages,
        weeklyDigest: notifDigest,
        marketplace: notifMarketplace,
      },
    };
    // TODO: call userService.updatePreferences(payload)
    console.log("Preferences payload:", payload);
    toast.success("Preferences saved!");
  };

  return (
    <div className="space-y-4 max-w-lg">

      {/* Language */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <Globe className="h-4 w-4 text-[#155DFC]" />
          <span className="text-sm font-semibold text-gray-800">Language</span>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-500 mb-4">Choose the language used across the platform.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "en", label: "English", emoji: "🇬🇧" },
              { value: "fr", label: "Français", emoji: "🇫🇷" },
            ].map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => setLanguage(lang.value)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                  language === lang.value
                    ? "border-[#155DFC] bg-[#155DFC]/5 text-[#155DFC]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                <span className="text-xl">{lang.emoji}</span>
                {lang.label}
                {language === lang.value && <Check className="h-4 w-4 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <Palette className="h-4 w-4 text-[#155DFC]" />
          <span className="text-sm font-semibold text-gray-800">Theme</span>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-500 mb-4">Choose how the platform looks to you.</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", label: "Light", swatch: "bg-white border-gray-200", dot: "bg-gray-100" },
              { value: "dark", label: "Dark", swatch: "bg-gray-900 border-gray-700", dot: "bg-gray-700" },
              { value: "system", label: "System", swatch: "bg-gradient-to-br from-white to-gray-900 border-gray-300", dot: "bg-gray-400" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-medium transition-all",
                  theme === t.value ? "border-[#155DFC] text-[#155DFC]" : "border-gray-200 text-gray-500 hover:border-gray-300"
                )}
              >
                <div className={cn("w-full h-8 rounded-lg border", t.swatch)} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {/* <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <Bell className="h-4 w-4 text-[#155DFC]" />
          <span className="text-sm font-semibold text-gray-800">Email Notifications</span>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "New community posts", description: "Get notified when someone posts in the feed.", state: notifNewPost, setter: setNotifNewPost },
            { label: "Mentions & replies", description: "When someone mentions or replies to you.", state: notifMentions, setter: setNotifMentions },
            { label: "Direct messages", description: "Receive email alerts for new messages.", state: notifMessages, setter: setNotifMessages },
            { label: "Weekly digest", description: "A weekly summary of activity in your network.", state: notifDigest, setter: setNotifDigest },
            { label: "Marketplace matches", description: "When your Offers or Needs get a potential match.", state: notifMarketplace, setter: setNotifMarketplace },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <Toggle checked={item.state} onChange={item.setter} />
            </div>
          ))}
        </div>
      </div> */}

      {/* Save */}
      <Button
        onClick={handleSavePreferences}
        className="w-full h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
      >
        Save Preferences
      </Button>
    </div>
  );
}

export default PreferencesTab