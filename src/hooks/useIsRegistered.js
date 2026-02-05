"use client";

import { useState, useEffect } from "react";
import { getRegisteredFromCookie } from "@/lib/auth-cookie";

/**
 * Returns whether the user has gone through login/register (and thus should see full portal layout).
 * Only reliable after mount (cookie is read client-side).
 */
export function useIsRegistered() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsRegistered(getRegisteredFromCookie());
  }, []);

  return { isRegistered, mounted };
}
