import React from "react";
import NavLink from "@/components/header/nav-link";
import { currentUser } from "@/src/lib/authentication";

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

export default async function NavLinks() {
  const user = await currentUser();
  const isAuthenticated = !!user;
  return isAuthenticated ? (
    <nav>
      <ul className="flex space-x-5">
        {navItems.map(({ name, path }) => (
          <li key={path}>
            <NavLink href={path}>{name}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  ) : null;
}
