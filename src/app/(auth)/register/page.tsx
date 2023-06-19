import { FC } from "react";
import Login from "@/components/Login";

interface RegisterPageProps {}

const RegisterPage: FC<RegisterPageProps> = ({}) => {
  return (
    <div className="container flex justify-center items-center min-h-screen-minus-header">
      <Login type="register" />
    </div>
  );
};

export default RegisterPage;
