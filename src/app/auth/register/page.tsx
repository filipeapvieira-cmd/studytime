import RegisterForm from "@/src/components/auth/register-form";
import MobileMessage from "@/src/components/Mobile-Message";

const RegisterPage = () => {
  return (
    <>
      <div className="md:hidden">
        <MobileMessage />
      </div>
      <div className="hidden md:flex container justify-center items-center flex-1">
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
