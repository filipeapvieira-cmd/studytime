import Link from "next/link";
import { FC } from "react";
import { Icons } from "@/components/icons";
import Navlink from "./ui/Navlink";
import Btnlink from "./ui/Btnlink";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center gap-6">
        <Link href="/">
          <Icons.logo size={50} />
        </Link>
        <nav>
          <Navlink href="/">Dashboard</Navlink>
        </nav>
      </div>
      <nav>
        <Btnlink>
          <Icons.login />
        </Btnlink>
      </nav>
    </div>
  );
};

export default Header;
