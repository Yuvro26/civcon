import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CivicConnect" },
      { name: "description", content: "Get in touch with the CivicConnect team." },
      { property: "og:title", content: "Contact CivicConnect" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: Contact,
});

const INFO = [
  { icon: Mail, label: "Email", value: "support@civicconnect.app" },
  { icon: Phone, label: "Phone", value: "+91 1800 200 300" },
  { icon: MapPin, label: "Office", value: "Smart City Tower, Sector 14" },
];

function Contact() {
  return (
    <SiteLayout>
      <div className="py-8">
        <PageHeader
          eyebrow="Contact"
          title="Get in touch"
          subtitle="Questions, partnerships, or feedback — we're here to help."
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 px-4 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {INFO.map((item) => (
              <div key={item.label} className="glass-card flex items-center gap-4 rounded-2xl p-5">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="font-medium">{item.value}</div>
                </div>
              </div>
            ))}
            <div className="glass-card grid h-44 place-items-center rounded-2xl text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Google Maps (integration ready)
              </span>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent! We'll get back to you soon.");
            }}
            className="glass-card space-y-4 rounded-2xl p-6 lg:col-span-3"
          >
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Name</Label>
              <Input id="c-name" placeholder="Your name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" placeholder="you@email.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-msg">Message</Label>
              <Textarea id="c-msg" rows={5} placeholder="How can we help?" required />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Send Message <Send className="h-4 w-4" />
            </Button>
          </motion.form>
        </div>
      </div>
    </SiteLayout>
  );
}
