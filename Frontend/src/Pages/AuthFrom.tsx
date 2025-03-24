// src/components/AuthForm.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import LoginForm from "./LoginPage";
import RegisterForm from "./RegisterPage";
import useAuth from "@/customHooks/useAuth";
import { useNavigate } from "react-router-dom";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const loggedIn = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "LOGIN" : "REGISTER"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLogin ? <LoginForm /> : <RegisterForm />}
          <div className="mt-4 text-center">
            <button
              onClick={toggleForm}
              className="text-sm text-blue-500 hover:underline"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
