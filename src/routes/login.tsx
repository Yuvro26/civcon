import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
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
          <h1 className="mt-5 text-center text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Login to continue improving your city.
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Demo login — backend coming soon!");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@email.com" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-9" required />
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/login" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Login <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Are you an authority?{" "}
            <Link to="/admin" className="text-primary hover:underline">
              Admin login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
