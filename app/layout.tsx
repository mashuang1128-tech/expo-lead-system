import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surgical Energy Solutions Lead Capture",
  description: "A mobile-friendly lead capture landing page for exhibition and B2B product inquiries."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
