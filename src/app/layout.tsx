import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yoodli | AI Roleplays & Communication Coaching Platform",
  description:
    "Practice high-stakes sales calls, objection handling, interviews, and presentations with realistic AI Personas and instant rubric & speech analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#524FFC]/20 selection:text-[#040348]">
        {children}
      </body>
    </html>
  );
}
