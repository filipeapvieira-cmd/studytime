import React from "react";
import NavLink, { type IconKey } from "@/components/header/nav-link";
import { currentRole, currentUser } from "@/src/lib/authentication";

interface NavItem {
  name: string;
  path: string;
  roles: string[];
  icon?: IconKey;
}

const navItems: NavItem[] = [
  {
    name: "Journaling",
    path: "/journaling",
    roles: ["USER", "ADMIN"],
    icon: "BookOpen",
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    roles: ["USER", "ADMIN"],
    icon: "LayoutDashboard",
  },
  {
    name: "Analytics",
    path: "/analytics",
    roles: ["USER", "ADMIN"],
    icon: "BarChart2",
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
    item.roles.includes(userRole),
  );

  if (accessibleNavItems.length === 0) return null;

  return (
    <nav>
      <ul className="flex space-x-5">
        {accessibleNavItems.map(({ name, path, icon }) => (
          <li key={path}>
            <NavLink href={path} icon={icon}>
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
