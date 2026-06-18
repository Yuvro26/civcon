import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { adminLogin, adminExists } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminAuth,
});

function AdminAuth() {
  const navigate = useNavigate();
  const hasAdmin = typeof window !== "undefined" && adminExists();
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Navbar />
      <div className="absolute inset-0 -z-10 bg-hero-glow opacity-60" />
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 pt-24">
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
            Restricted access for verified administrators.
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Demo admin login — backend coming soon!");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="admin@city.gov" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-9" required />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Login as Admin <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-border/60 bg-secondary/40 p-3 text-center text-xs text-muted-foreground">
            Only one administrator account can be registered. After the first admin is created,
            registration is disabled and admins can only log in.
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link to="/admin-dashboard" className="font-semibold text-primary hover:underline">
              View Admin Dashboard (demo) →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
