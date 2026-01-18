import Link from "next/link";
import type React from "react";
import type { FC } from "react";
import { buttonVariants } from "@/src/components/ui/button";

interface BtnlinkProps {
  children: React.ReactNode;
}

const Btnlink: FC<BtnlinkProps> = ({ children }) => {
  return (
    <Link href="/auth/login" className={buttonVariants({ variant: "default" })}>
      {children}
    </Link>
  );
};

export default Btnlink;
