import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Java Start",
  description: "A learning app that pairs Next.js with a Java Spring Boot backend."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
