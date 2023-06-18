import { FC } from "react";
import { Icons } from "@/components/icons";
import { Label } from "./ui/label";

interface LoginProps {
  type: "login" | "register";
}

const Login: FC<LoginProps> = ({}) => {
  return (
    <div className="flex flex-col items-center justify-center w-96 rounded-md shadow-md overflow-hidden">
      <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground flex-1 w-full">
        <Icons.logo size={70} />
        <p className="text-3xl">Study Time</p>
      </div>
      <form>
        <Label>Email</Label>
      </form>
    </div>
  );
};

export default Login;
