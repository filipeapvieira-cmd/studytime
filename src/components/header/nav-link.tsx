"use client";

import { clsx } from "clsx";
import { BarChart2, BookOpen, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconMapping = {
  BookOpen,
  LayoutDashboard,
  BarChart2,
};

export type IconKey = keyof typeof iconMapping;

type NavLinkProps = {
  children: string;
  href: string;
  icon?: IconKey;
};

const NavLink = ({ href, children, icon }: NavLinkProps) => {
  const isActive = href === usePathname();
  const IconComponent = icon ? iconMapping[icon] : null;

  return (
    <Link
      href={href}
      className={clsx(
        " hover:text-white px-3 py-2 rounded-md font-medium flex items-center space-x-2 transition duration-150 ease-in-out",
        {
          "text-white": isActive,
          "text-zinc-400": !isActive,
        },
      )}
    >
      {IconComponent && <IconComponent size={20} />}
      <span>{children}</span>
    </Link>
  );
};

export default NavLink;
