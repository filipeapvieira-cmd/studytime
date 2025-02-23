import React from "react";
import UserNav from "../User-Nav";
import Btnlink from "../ui/Btnlink";
import { Icons } from "../icons";
import { currentUser } from "@/src/lib/authentication";

export default async function Login() {
  const user = await currentUser();
  const isAuthenticated = !!user && user.name && user.email;

  if (!isAuthenticated) {
    return (
      <nav>
        <Btnlink>
          <Icons.Login />
        </Btnlink>
      </nav>
    );
  }

  const userInfo = { name: user.name as string, email: user.email as string };

  return (
    <nav>
      <UserNav data={userInfo} />
    </nav>
  );
}
