import { FC } from "react";
import Link from "next/link";

interface NavlinkProps {
  children: string;
  href: string;
}

const Navlink: FC<NavlinkProps> = ({ children, href }) => {
  return (
    <Link
      href={href}
      className="transition-colors hover:text-foreground/80 text-lg"
    >
      {children}
    </Link>
  );
};

export default Navlink;
