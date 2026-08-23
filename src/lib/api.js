/** Backend API origin used by the whole app. */
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "https://api.helpaana.com").replace(
    /\/$/,
    ""
  );

export function apiUrl(path = "") {
  const suffix = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${API_BASE}${suffix}`;
}
