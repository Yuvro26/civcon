import { useSyncExternalStore } from "react";

const KEY = "cc_auth";
const ADMIN_KEY = "cc_admin_auth";
const EVENT = "cc-auth-change";

// Re-export validation helpers so existing imports keep working.
export {
  validateEmail,
  validatePassword,
  validateMobile,
  type AuthResult,
} from "./validation";

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

// ---- User session ----
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function setLoggedIn() {
  try {
    localStorage.setItem(KEY, "true");
  } catch {
    /* ignore */
  }
  emit();
}

export function login() {
  setLoggedIn();
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

// ---- Admin session ----
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ADMIN_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAdminLoggedIn() {
  try {
    localStorage.setItem(ADMIN_KEY, "true");
  } catch {
    /* ignore */
  }
  emit();
}

export function adminLogout() {
  try {
    localStorage.removeItem(ADMIN_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

export function useAdminAuth(): boolean {
  return useSyncExternalStore(subscribe, isAdminLoggedIn, () => false);
}
