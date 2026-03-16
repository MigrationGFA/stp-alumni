"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import useAuthStore from "@/lib/store/useAuthStore";

/**
 * Banner shown when the user still has a temporary password.
 * Dismissible per session. Links to the security tab in settings.
 */
export default function PasswordChangeBanner() {
  const t = useTranslations("PasswordBanner");
  const passwordChangeRequired = useAuthStore((state) => state.passwordChangeRequired);
  const [dismissed, setDismissed] = useState(false);

  if (!passwordChangeRequired || dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">
          {t("message")}{" "}
          <Link href="/dashboard/settings" className="underline font-medium text-amber-900 hover:text-amber-700">
            {t("changeNow")}
          </Link>
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-amber-100 rounded shrink-0"
        aria-label={t("dismiss")}
      >
        <X className="h-4 w-4 text-amber-600" />
      </button>
    </div>
  );
}
