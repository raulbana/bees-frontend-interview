import Image from "next/image";
import React from "react";
import BeeIllustration from "../../assets/illustrations/bee-icon.png";
import LoginForm from "./components/LoginForm/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col w-screen h-screen bg-primary-yellow">
      <div className="flex flex-col items-center justify-center flex-1">
        <LoginForm />
      </div>
      <Image
        src={BeeIllustration}
        alt={"bee illustration"}
        width={200}
        height={200}
      />
    </div>
  );
};

export default Login;
