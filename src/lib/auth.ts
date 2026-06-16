import { useSyncExternalStore } from "react";

const KEY = "cc_auth";
const EVENT = "cc-auth-change";

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function login() {
  try {
    localStorage.setItem(KEY, "true");
  } catch {
    /* ignore */
  }
  emit();
}

export function logout() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useAuth(): boolean {
  return useSyncExternalStore(subscribe, isLoggedIn, () => false);
}
