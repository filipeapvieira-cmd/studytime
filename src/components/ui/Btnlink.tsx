import React, { FC } from "react";
import { buttonVariants } from "@/src/components/ui/button";
import Link from "next/link";

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
