/*
  Demo-only sign-in state kept in localStorage. There is no backend:
  any email + password "signs in". Replace with real auth before shipping.
*/
const KEY = "signedIn";

export const isSignedOut = () => { try { return localStorage.getItem(KEY) === "0"; } catch { return false; } };
export const signIn = () => { try { localStorage.setItem(KEY, "1"); } catch {} };
export const signOut = () => { try { localStorage.setItem(KEY, "0"); } catch {} };
