import { createServerFn } from "@tanstack/react-start";
import {
  validateEmail,
  validatePassword,
  validateMobile,
  normalizeEmail,
  type AuthResult,
} from "./validation";

// ---- Password hashing (Web Crypto — available on the server runtime) ----
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID().replace(/-/g, "");
  const hash = await sha256Hex(salt + password);
  return `${salt}:${hash}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = await sha256Hex(salt + password);
  return computed === hash;
}

// ---- Register ----
export const registerUser = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      name: string;
      email: string;
      mobile: string;
      password: string;
      confirm: string;
    }) => data,
  )
  .handler(async ({ data }): Promise<AuthResult> => {
    const emailErr = validateEmail(data.email);
    if (emailErr) return { ok: false, error: emailErr };

    const mobileErr = validateMobile(data.mobile);
    if (mobileErr) return { ok: false, error: mobileErr };

    const passErr = validatePassword(data.password);
    if (passErr) return { ok: false, error: passErr };

    if (data.password !== data.confirm) {
      return { ok: false, error: "Passwords do not match." };
    }

    const email = normalizeEmail(data.email);
    const { getItem, putItem } = await import("./dynamo.server");

    const existing = await getItem(`user#${email}`);
    if (existing) {
      return { ok: false, error: "An account with this email already exists. Please login." };
    }

    const created = await putItem(
      {
        pk: `user#${email}`,
        email,
        name: data.name.trim(),
        mobile: data.mobile.replace(/\D/g, ""),
        password: await hashPassword(data.password),
        createdAt: new Date().toISOString(),
      },
      true,
    );

    if (!created) {
      return { ok: false, error: "An account with this email already exists. Please login." };
    }
    return { ok: true };
  });

// ---- Login ----
export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }): Promise<AuthResult> => {
    const emailErr = validateEmail(data.email);
    if (emailErr) return { ok: false, error: emailErr };
    if (!data.password) return { ok: false, error: "Password is required." };

    const email = normalizeEmail(data.email);
    const { getItem } = await import("./dynamo.server");

    const user = await getItem(`user#${email}`);
    if (!user) {
      return { ok: false, error: "No account found. Please create an account first." };
    }
    if (!(await verifyPassword(data.password, user.password))) {
      return { ok: false, error: "Invalid email or password." };
    }
    return { ok: true };
  });

// ---- Admin: whether an admin is already registered ----
export const adminExists = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ exists: boolean }> => {
    const { getItem } = await import("./dynamo.server");
    const admin = await getItem("admin#config");
    return { exists: admin !== null };
  },
);

// ---- Admin login: first successful login locks in the credentials ----
export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }): Promise<AuthResult> => {
    const emailErr = validateEmail(data.email);
    if (emailErr) return { ok: false, error: emailErr };

    const passErr = validatePassword(data.password);
    if (passErr) return { ok: false, error: passErr };

    const email = normalizeEmail(data.email);
    const { getItem, putItem } = await import("./dynamo.server");

    const existing = await getItem("admin#config");

    if (!existing) {
      // First admin — register these credentials.
      const created = await putItem(
        {
          pk: "admin#config",
          email,
          password: await hashPassword(data.password),
          createdAt: new Date().toISOString(),
        },
        true,
      );
      if (!created) {
        // Race: someone registered first. Fall through to verify.
        const now = await getItem("admin#config");
        if (
          !now ||
          now.email !== email ||
          !(await verifyPassword(data.password, now.password))
        ) {
          return { ok: false, error: "Invalid admin credentials." };
        }
        return { ok: true };
      }
      return { ok: true };
    }

    if (existing.email !== email || !(await verifyPassword(data.password, existing.password))) {
      return { ok: false, error: "Invalid admin credentials." };
    }
    return { ok: true };
  });
