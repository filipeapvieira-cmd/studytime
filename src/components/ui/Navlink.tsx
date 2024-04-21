import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface NavlinkProps {
  children: string;
  href: string;
}

const Navlink: FC<NavlinkProps> = ({ children, href }) => {
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

export default Navlink;
