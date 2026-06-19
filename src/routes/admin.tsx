import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail, validatePassword } from "@/lib/auth";
import { ensureAdmin, checkAdminExists } from "@/lib/auth.functions";

export const Route = createFileRoute("/admin")({
  component: AdminAuth,
});

function AdminAuth() {
  const navigate = useNavigate();
  const doEnsureAdmin = useServerFn(ensureAdmin);
  const doCheckAdminExists = useServerFn(checkAdminExists);
  const [hasAdmin, setHasAdmin] = useState(false);

  useEffect(() => {
    doCheckAdminExists()
      .then((r) => setHasAdmin(r.exists))
      .catch(() => setHasAdmin(false));
  }, [doCheckAdminExists]);

  async function handleAdmin(email: string, password: string) {
    const emailErr = validateEmail(email);
    if (emailErr) return toast.error(emailErr);
    const passErr = validatePassword(password);
    if (passErr) return toast.error(passErr);

    try {
      // Try to sign in with the existing account.
      let signInError = (await supabase.auth.signInWithPassword({ email, password })).error;

      // If sign-in fails and no admin exists yet, create the first admin account.
      if (signInError && !hasAdmin) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError && !/already|registered|exists/i.test(signUpError.message)) {
          toast.error(signUpError.message);
          return;
        }
        signInError = (await supabase.auth.signInWithPassword({ email, password })).error;
      }

      if (signInError) {
        toast.error("Invalid admin credentials.");
        return;
      }

      const { admin } = await doEnsureAdmin();
      if (!admin) {
        await supabase.auth.signOut();
        toast.error("You are not authorized as an administrator.");
        return;
      }

      toast.success("Admin login successful! Redirecting…");
      setTimeout(() => navigate({ to: "/admin-dashboard" }), 600);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }


  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-hero-glow opacity-60" />
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full rounded-3xl p-8"
        >
          <div className="flex justify-center">
            <Logo showText={false} />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" /> Authority Access
          </div>
          <h1 className="mt-2 text-center text-2xl font-bold">Admin Login</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {hasAdmin
              ? "Restricted access for the registered administrator."
              : "First login here becomes the administrator."}
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              const password = (form.elements.namedItem("password") as HTMLInputElement).value;
              try {
                const result = await doAdminLogin({ data: { email, password } });
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                setAdminLoggedIn();
                toast.success("Admin login successful! Redirecting…");
                setTimeout(() => navigate({ to: "/admin-dashboard" }), 600);
              } catch {
                toast.error("Something went wrong. Please try again.");
              }
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="admin@city.gov" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-9" required />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              {hasAdmin ? "Login as Admin" : "Register as Admin"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-border/60 bg-secondary/40 p-3 text-center text-xs text-muted-foreground">
            Only one administrator account can be registered. The first person to log in here
            becomes the admin, and those credentials are locked in for all future logins.
          </div>

        </motion.div>
      </div>
    </div>
  );
}
