import React from "react";
import NavLink from "@/components/header/nav-link";
import { currentRole, currentUser } from "@/src/lib/authentication";

const navItems = [
  {
    name: "Journaling",
    path: "/journaling",
    roles: ["USER", "ADMIN"],
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    roles: ["USER", "ADMIN"],
  },
  {
    name: "Charts",
    path: "/charts",
    roles: ["USER", "ADMIN"],
  },
  {
    name: "Admin",
    path: "/admin",
    roles: ["ADMIN"],
  },
];

export default async function NavLinks() {
  const user = await currentUser();
  const userRole = await currentRole();
  if (!user || !userRole) return null;
  const accessibleNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );
  if (accessibleNavItems.length === 0) return null;

  return (
    <nav>
      <ul className="flex space-x-5">
        {accessibleNavItems.map(({ name, path }) => (
          <li key={path}>
            <NavLink href={path}>{name}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
