import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Navbar />
      <div className="absolute inset-0 -z-10 bg-hero-glow opacity-60" />
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full rounded-3xl p-8"
        >
          <div className="flex justify-center">
            <Logo showText={false} />
          </div>
          <h1 className="mt-5 text-center text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Join the community making cities better.
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Account created (demo)! Redirecting to dashboard.");
              setTimeout(() => navigate({ to: "/dashboard" }), 800);
            }}
          >
            <Field id="name" label="Full Name" icon={User} placeholder="Your name" />
            <Field id="email" label="Email" icon={Mail} type="email" placeholder="you@email.com" />
            <Field id="mobile" label="Mobile Number" icon={Phone} placeholder="+91 98765 43210" />
            <Field id="password" label="Password" icon={Lock} type="password" placeholder="••••••••" />
            <Field
              id="confirm"
              label="Confirm Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
            />
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Create Account <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input id={id} type={type} placeholder={placeholder} className="pl-9" required />
      </div>
    </div>
  );
}
