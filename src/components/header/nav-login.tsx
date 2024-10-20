import React from "react";
import UserNav from "../User-Nav";
import Btnlink from "../ui/Btnlink";
import { Icons } from "../icons";
import { currentUser } from "@/src/lib/authentication";

export default async function Login() {
  const user = await currentUser();
  const isAuthenticated = !!user;
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
