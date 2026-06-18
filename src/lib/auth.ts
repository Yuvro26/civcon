import { useSyncExternalStore } from "react";

const KEY = "cc_auth";
const USERS_KEY = "cc_users";
const EVENT = "cc-auth-change";

type StoredUser = {
  name?: string;
  email: string;
  mobile?: string;
  password: string;
};

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export type AuthResult = { ok: true } | { ok: false; error: string };

// ---- Validation helpers ----
export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return "Please enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include a special character.";
  return null;
}

export function validateMobile(mobile: string): string | null {
  const digits = mobile.replace(/\D/g, "");
  if (!digits) return "Mobile number is required.";
  if (digits.length !== 10) return "Enter a valid 10-digit mobile number.";
  if (!/^[6-9]/.test(digits)) return "Mobile number must start with 6-9.";
  return null;
}

// ---- Account actions ----
export function registerUser(input: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirm: string;
}): AuthResult {
  const emailErr = validateEmail(input.email);
  if (emailErr) return { ok: false, error: emailErr };

  const mobileErr = validateMobile(input.mobile);
  if (mobileErr) return { ok: false, error: mobileErr };

  const passErr = validatePassword(input.password);
  if (passErr) return { ok: false, error: passErr };

  if (input.password !== input.confirm) {
    return { ok: false, error: "Passwords do not match." };
  }

  const email = normalizeEmail(input.email);
  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "An account with this email already exists. Please login." };
  }

  users.push({
    name: input.name.trim(),
    email,
    mobile: input.mobile.replace(/\D/g, ""),
    password: input.password,
  });
  writeUsers(users);
  return { ok: true };
}

export function loginUser(input: { email: string; password: string }): AuthResult {
  const emailErr = validateEmail(input.email);
  if (emailErr) return { ok: false, error: emailErr };
  if (!input.password) return { ok: false, error: "Password is required." };

  const email = normalizeEmail(input.email);
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    return { ok: false, error: "No account found. Please create an account first." };
  }
  if (user.password !== input.password) {
    return { ok: false, error: "Invalid email or password." };
  }

  setLoggedIn();
  return { ok: true };
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

function setLoggedIn() {
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
