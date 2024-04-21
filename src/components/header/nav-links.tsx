"use client";

import React from "react";
import Navlink from "../ui/Navlink";
import { useSession } from "next-auth/react";

const navItems = [
  {
    name: "Journaling",
    path: "/journaling",
  },
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Charts",
    path: "/charts",
  },
];

export default function NavLinks() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  return isAuthenticated ? (
    <nav>
      <ul className="flex space-x-5">
        {navItems.map(({ name, path }) => (
          <li key={path}>
            <Navlink href={path}>{name}</Navlink>
          </li>
        ))}
      </ul>
    </nav>
  ) : null;
}
