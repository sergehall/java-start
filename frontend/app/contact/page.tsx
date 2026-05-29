import { ContactPanel } from "@/features/contact/ContactPanel";
import { AppShell } from "@/shared/ui/AppShell";

export default function ContactPage() {
  return (
    <AppShell active="contact" eyebrow="next-java://contact">
      <ContactPanel />
    </AppShell>
  );
}
