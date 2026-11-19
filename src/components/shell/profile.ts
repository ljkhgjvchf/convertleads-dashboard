"use client";

import { useStored } from "@/lib/useStored";

export type Profile = { email: string; first: string; last: string; dob: string; isPublic: boolean; photo: string };

export const DEFAULT_PROFILE: Profile = {
  email: "nicola@convertleads.xyz", first: "Nicola", last: "Da Dalto", dob: "", isPublic: true, photo: "/nicola.jpg",
};

/** Workspace shown in the account card / menu / login. */
export const WORKSPACE = { name: "Convertleads", site: "convertleads.xyz", logoDark: "/brand/logo-dark.png", logoWhite: "/brand/logo-white.png" };

/** The signed-in user's profile, shared by sidebar, account menu, headers and Settings → Profile. */
export const useProfile = () => useStored<Profile>("profile.v3", DEFAULT_PROFILE);

export const fullName = (p: Profile) => `${p.first} ${p.last}`.trim() || "Unnamed";
