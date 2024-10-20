"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

type NavLinkProps = {
  children: string;
  href: string;
};

const NavLink = ({ children, href }: NavLinkProps) => {
  const isActive = href === usePathname();
  return (
    <Link
      href={href}
      className={clsx("transition-colors hover:text-foreground/80 text-lg", {
        "text-foreground/70": !isActive,
        "text-foreground": isActive,
      })}
    >
      {children}
    </Link>
  );
};

export default NavLink;
