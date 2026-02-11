/**
 * Cookie used to mark that the user has gone through login/register flow.
 * When set, they see the full portal layout (sidebar + user header) on Events and Marketplace.
 * When not set, they see the public layout (no sidebar, no user header).
 */
const REGISTERED_COOKIE_NAME = "stp-alumni-registered";
const COOKIE_MAX_AGE_DAYS = 365;

/**
 * Set the "registered user" cookie (call after login or completing signup).
 */
export function setRegisteredCookie() {
  if (typeof document === "undefined") return;
  const value = "true";
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${REGISTERED_COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Read the "registered user" cookie. Returns true only if the cookie is set and equals "true".
 */
export function getRegisteredFromCookie() {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${REGISTERED_COOKIE_NAME}=([^;]*)`)
  );
  return match ? match[1] === "true" : false;
}
