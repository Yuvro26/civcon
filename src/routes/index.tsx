import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  MapPin,
  Camera,
  Bell,
  BarChart3,
  Building2,
  Smartphone,
  ArrowRight,
  UserPlus,
  Upload,
  FileText,
  Send,
  ClipboardCheck,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { SplashScreen } from "@/components/SplashScreen";
import { useAuth } from "@/lib/auth";
import heroCity from "@/assets/hero-city.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [booting, setBooting] = useState(true);
  const loggedIn = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
      if (!loggedIn) {
        navigate({ to: "/login" });
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [loggedIn, navigate]);

  if (booting || !loggedIn) {
    return <SplashScreen />;
  }

  return <Landing />;
}


const FEATURES = [
  { icon: MapPin, title: "GPS Location Detection", desc: "Auto-pinpoint the exact location of any issue with one tap." },
  { icon: Camera, title: "Photo Upload", desc: "Attach multiple images so authorities see the real picture." },
  { icon: Bell, title: "Real-Time Updates", desc: "Instant notifications at every stage of your complaint." },
  { icon: BarChart3, title: "Issue Tracking", desc: "Follow your complaint from submission to resolution." },
  { icon: Building2, title: "Authority Dashboard", desc: "A powerful control center for officials and admins." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Beautifully responsive on every device, everywhere." },
];

const STEPS = [
  { icon: UserPlus, title: "Register / Login", desc: "Create your free citizen account in seconds." },
  { icon: Upload, title: "Upload Photo", desc: "Snap and upload a photo of the civic issue." },
  { icon: FileText, title: "Add Description", desc: "Describe the problem and set its priority." },
  { icon: Send, title: "Submit Complaint", desc: "Send it directly to the right authority." },
  { icon: ClipboardCheck, title: "Authority Reviews", desc: "Officials verify and assign the issue." },
  { icon: CheckCircle2, title: "Issue Resolved", desc: "Track progress until it's fully resolved." },
];

const STATS = [
  { value: "48,200+", label: "Issues Reported" },
  { value: "41,500+", label: "Issues Resolved" },
  { value: "120+", label: "Wards Covered" },
  { value: "96%", label: "Satisfaction Rate" },
];

const STORIES = [
  {
    quote:
      "Reported a dangerous pothole on my street — it was fixed within 4 days. CivicConnect actually works!",
    name: "Aarav Sharma",
    role: "City Hero • 48 reports",
  },
  {
    quote:
      "The dark streetlight near my home was repaired after years of complaints. The tracking kept me informed throughout.",
    name: "Priya Nair",
    role: "Gold Reporter • 39 reports",
  },
  {
    quote:
      "Garbage collection in our colony improved drastically once the whole community started reporting through the app.",
    name: "Rohan Mehta",
    role: "Gold Reporter • 31 reports",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-4 ${className}`}>{children}</section>;
}

function Landing() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative -mt-24 overflow-hidden pt-32">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroCity}
            alt="Smart city skyline with location markers"
            className="h-full w-full object-cover opacity-40"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          <div className="absolute inset-0 bg-hero-glow" />
        </div>

        <Section className="relative pb-24 pt-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
          >
            Connecting Citizens. Solving Problems.
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mx-auto mt-6 max-w-4xl text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            Report Civic Issues <span className="text-gradient">in Seconds</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Help build a cleaner, safer, and smarter city. Snap, report, and track local issues —
            all in one beautifully simple platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/report">
                Report Issue <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/track">Track Issue</Link>
            </Button>
          </motion.div>

          {/* floating markers */}
          <div className="pointer-events-none absolute left-[8%] top-24 hidden lg:block">
            <div className="animate-float glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm shadow-glow">
              <MapPin className="h-4 w-4 text-primary" /> Pothole reported
            </div>
          </div>
          <div className="pointer-events-none absolute right-[8%] top-40 hidden lg:block">
            <div
              className="animate-float glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm shadow-glow"
              style={{ animationDelay: "1.5s" }}
            >
              <CheckCircle2 className="h-4 w-4 text-success" /> Issue resolved
            </div>
          </div>
        </Section>
      </section>

      {/* STATS */}
      <Section className="-mt-6">
        <div className="glass-card grid grid-cols-2 gap-6 rounded-3xl p-8 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-3xl font-extrabold text-gradient sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FEATURES */}
      <Section className="mt-28">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to fix your city"
          subtitle="A complete toolkit for citizens and authorities to collaborate and resolve issues faster."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: (i % 3) * 0.08 }}
              className="group glass-card rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="mt-28">
        <SectionHeading
          eyebrow="How It Works"
          title="From report to resolution in 6 steps"
          subtitle="A transparent process that keeps you informed every step of the way."
        />
        <div className="relative mt-14">
          <div className="absolute left-0 top-7 hidden h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.06 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/30 bg-card shadow-glow">
                  <step.icon className="h-6 w-6 text-primary" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SUCCESS STORIES */}
      <Section className="mt-28">
        <SectionHeading
          eyebrow="Success Stories"
          title="Real change, made by real citizens"
          subtitle="Thousands of issues resolved thanks to an engaged community."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="glass-card flex flex-col rounded-2xl p-6"
            >
              <Quote className="h-7 w-7 text-primary/60" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">"{story.quote}"</p>
              <div className="mt-5">
                <div className="font-semibold">{story.name}</div>
                <div className="text-xs text-muted-foreground">{story.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="mt-28">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-surface p-10 text-center shadow-elegant sm:p-16">
          <div className="absolute inset-0 -z-10 bg-hero-glow opacity-70" />
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            Ready to make your city better?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of citizens reporting and resolving issues every day. It's free.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/register">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeUp}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
      <p className="mt-4 text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}
