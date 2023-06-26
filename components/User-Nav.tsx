"use client"
import { FC } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { Icons } from "@/components/icons";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
interface UserNavProps {
  
}

const UserNav: FC<UserNavProps> = ({}) => {
  const { data: session, status } = useSession();
  const { setTheme, theme } = useTheme();
  
  const handleChangeTheme = () => {
    if (theme === "dark") {
        setTheme("light");
    } else {
        setTheme("dark");
    }
  }
  


  return( 
  <DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant={"default"} className="rounded-full h-9 w-9 p-1">
        <Icons.user/>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>
    <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
                {session?.user?.email}
            </p>
          </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem onClick={handleChangeTheme}>
        <Icons.moon className='mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
        <Icons.sun className='mr-2 h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
        <span>{`${theme === "dark" ? "Light" : "Dark"} mode`}</span>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => signOut()}>
          <Icons.login className="mr-2 h-4 w-4" />
          <span>Log out</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
);
}

export default UserNav;