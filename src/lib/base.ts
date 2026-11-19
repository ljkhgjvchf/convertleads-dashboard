/** The app is served under convertleads.xyz/dashboard. Keep in sync with next.config.ts `basePath`. */
export const BASE_PATH = "/dashboard";

/** Prefix a /public file path (Next doesn't do this for plain <img src>). Leaves full URLs alone. */
export const asset = (p: string) => (/^(https?:|data:)/.test(p) || p.startsWith(BASE_PATH + "/") ? p : `${BASE_PATH}${p.startsWith("/") ? p : `/${p}`}`);
