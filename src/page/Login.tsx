// App.tsx
import React from "react";
import LoginForm from "../components/login/Login";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;
