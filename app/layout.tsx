import "@/app/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { AuthGate } from "@/components/features/auth/components/auth-gate";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "SkillSwap",
  description: "Find and share skills with your community",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <AppShell>
          <AuthGate defaultAuthed={false}>{children}</AuthGate>
        </AppShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}