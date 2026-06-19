import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Admin management server functions.
 * The first authenticated user to claim admin (when none exists) becomes the
 * administrator. Afterwards only existing admins pass.
 */

// Whether an administrator has already been registered (public, boolean only).
export const checkAdminExists = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ exists: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) throw error;
    return { exists: (count ?? 0) > 0 };
  },
);

// Grant admin to the current user if none exists yet; otherwise verify.
export const ensureAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ admin: boolean }> => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: admins, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    if (error) throw error;

    if (!admins || admins.length === 0) {
      const { error: insErr } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (insErr) throw insErr;
      return { admin: true };
    }

    return { admin: admins.some((a) => a.user_id === userId) };
  });
