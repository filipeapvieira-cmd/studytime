import Link from "next/link";
import NavLinks from "@/src/components/header/nav-links";
import Login from "@/src/components/header/nav-login";
import { Icons } from "@/src/components/icons";

function Header() {
  return (
    <header className="max-w-6xl md:min-w-[1000px] w-4/5 mx-auto flex justify-between items-center p-4 h-header">
      <Link href="/">
        <Icons.Logo size={50} />
      </Link>
      <NavLinks />
      <Login />
    </header>
  );
}

export default Header;
