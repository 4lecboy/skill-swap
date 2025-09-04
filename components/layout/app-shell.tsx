import { ReactNode } from "react";
import { MobileHeader } from "./mobile-header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MobileHeader />
      <div className="container mx-auto flex-1 px-4 py-6">{children}</div>
    </div>
  );
}