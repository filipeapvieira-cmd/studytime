"use client";

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import Navlink from "./ui/Navlink";
import Btnlink from "./ui/Btnlink";
import { useSession } from "next-auth/react";
import UserNav from "@/components/User-Nav";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const { data: session, status } = useSession();
  //console.log(session);
  console.log(status);

  return (
    <div className="container flex justify-between items-center py-4 h-header">
      <div className="flex items-center gap-6">
        <Link href="/">
          <Icons.logo size={50} />
        </Link>
        {status == "authenticated" &&
        <nav>
          <Navlink href="/dashboard">Dashboard</Navlink>
        </nav>}
      </div>
      <nav>
        {status == "authenticated" && <UserNav />}
        {status != "authenticated" &&
        <Btnlink>
          <Icons.login/>
        </Btnlink>
        }
      </nav>
    </div>
  );
};

export default Header;
