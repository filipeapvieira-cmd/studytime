import React, { FC } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface BtnlinkProps {
  children: React.ReactNode;
}

const Btnlink: FC<BtnlinkProps> = ({ children }) => {
  return (
    <Link href="/login" className={buttonVariants({ variant: "default" })}>
      {children}
    </Link>
  );
};

export default Btnlink;
