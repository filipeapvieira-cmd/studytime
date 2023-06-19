import Login from "@/components/Login";
import { FC } from "react";

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = ({}) => {
  return (
    <div className="container flex justify-center items-center min-h-screen-minus-header">
      <Login type="login" />
    </div>
  );
};

export default LoginPage;
