"use client";

import { useSession } from "next-auth/react";
import React from "react";
import UserNav from "../User-Nav";
import Btnlink from "../ui/Btnlink";
import { Icons } from "../icons";

export default function Login() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  return (
    <nav>
      {isAuthenticated ? (
        <UserNav />
      ) : (
        <Btnlink>
          <Icons.login />
        </Btnlink>
      )}
    </nav>
  );
}
