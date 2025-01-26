import LoginForm from "@/src/components/auth/login-form";
import MobileMessage from "@/src/components/Mobile-Message";

const LoginPage = () => {
  return (
    <>
      <div className="md:hidden">
        <MobileMessage />
      </div>
      <div className="hidden md:flex container  justify-center items-center flex-1">
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
