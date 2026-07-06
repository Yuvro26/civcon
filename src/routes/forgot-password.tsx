import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail } from "@/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

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

          {sent ? (
            <>
              <div className="mt-5 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <MailCheck className="h-6 w-6" />
                </div>
              </div>
              <h1 className="mt-4 text-center text-2xl font-bold">Check your inbox</h1>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                If an account exists for that email, we've sent a link to reset your password.
              </p>
              <Button asChild variant="hero" size="lg" className="mt-7 w-full">
                <Link to="/login">
                  Back to login <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-center text-2xl font-bold">Forgot password?</h1>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Enter your email and we'll send you a reset link.
              </p>

              <form
                className="mt-7 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                  const emailErr = validateEmail(email);
                  if (emailErr) {
                    toast.error(emailErr);
                    return;
                  }
                  setBusy(true);
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) {
                      toast.error("Could not send reset email. Please try again.");
                      return;
                    }
                    setSent(true);
                  } catch {
                    toast.error("Something went wrong. Please try again.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
                  {busy ? "Sending…" : "Send reset link"} <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <p className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" />
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Back to login
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
