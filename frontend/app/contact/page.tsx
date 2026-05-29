import type { Metadata } from "next";
import { ContactPanel } from "@/features/contact/ContactPanel";
import { AppShell } from "@/shared/ui/AppShell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/contact"
  },
  description: "Contact the Java Start project owner through protected phone, email, and GitHub links.",
  title: "Contact"
};

export default function ContactPage() {
  return (
    <AppShell active="contact" eyebrow="next-java://contact">
      <ContactPanel />
    </AppShell>
  );
}
