import { SidebarNav } from "@/src/components/user-settings/sidebar-nav";
import type React from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex min-h-screen bg-black">
      <SidebarNav />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
