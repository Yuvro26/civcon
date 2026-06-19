import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail, validatePassword, validateMobile } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-hero-glow opacity-60" />
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
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
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value;
              const name = get("name").trim();
              const email = get("email").trim();
              const mobile = get("mobile");
              const password = get("password");
              const confirm = get("confirm");

              const emailErr = validateEmail(email);
              if (emailErr) return toast.error(emailErr);
              const mobileErr = validateMobile(mobile);
              if (mobileErr) return toast.error(mobileErr);
              const passErr = validatePassword(password);
              if (passErr) return toast.error(passErr);
              if (password !== confirm) return toast.error("Passwords do not match.");

              try {
                const { data, error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: { name, mobile: mobile.replace(/\D/g, "") },
                  },
                });
                if (error) {
                  toast.error(
                    /already|registered|exists/i.test(error.message)
                      ? "An account with this email already exists. Please login."
                      : error.message,
                  );
                  return;
                }
                if (data.user && data.user.identities && data.user.identities.length === 0) {
                  toast.error("An account with this email already exists. Please login.");
                  return;
                }
                toast.success("Account created! Please login to continue.");
                setTimeout(() => navigate({ to: "/login" }), 800);
              } catch {
                toast.error("Something went wrong. Please try again.");
              }
            }}
          >
            <Field id="name" label="Full Name" icon={User} placeholder="Your name" />
            <Field id="email" label="Email" icon={Mail} type="email" placeholder="you@email.com" />
            <Field id="mobile" label="Mobile Number" icon={Phone} type="tel" placeholder="9876543210" />
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
