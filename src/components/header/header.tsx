import Link from "next/link";
import { Icons } from "@/src/components/icons";
import NavLinks from "@/src/components/header/nav-links";
import Login from "@/src/components/header/nav-login";

function Header() {
  return (
    <header className="container flex justify-between items-center py-4 h-header">
      <div className="flex items-center gap-6">
        <Link href="/">
          <Icons.Logo size={50} />
        </Link>
        <NavLinks />
      </div>
      <Login />
    </header>
  );
}

export default Header;
