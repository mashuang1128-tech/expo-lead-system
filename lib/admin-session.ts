export const ADMIN_COOKIE_NAME = "admin_auth";
export const ADMIN_COOKIE_VALUE = "authenticated";

export function isAdminAuthenticated(cookieValue?: string | null) {
  return cookieValue === ADMIN_COOKIE_VALUE;
}
