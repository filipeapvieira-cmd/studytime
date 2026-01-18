"use client";

import { Bell, Settings, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/settings/profile", icon: User, label: "Profile" },
  { href: "/settings/security", icon: Shield, label: "Security" },
  {
    href: "/settings/image-upload",
    icon: Settings,
    label: "Image Upload",
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-zinc-800 p-6">
      <nav className="space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
