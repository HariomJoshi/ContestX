// src/components/LoginForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string(),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();
  const onSubmit = (data: RegisterFormInputs) => {
    // Check if passwords match on the frontend
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Destructure and prepare the payload
    const { name, email, password } = data;
    // Optionally split name into firstName and lastName:
    const nameParts = name.trim().split(" ");
    const firstname = nameParts[0];
    // Everything after the first word becomes lastName (or empty string if none)
    const lastname = nameParts.slice(1).join(" ") || "";

    const payload = {
      firstname,
      lastname,
      email,
      password,
    };

    // Make sure your env variable is prefixed with VITE_
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error("Backend URL is not defined in the env variables.");
      alert("Backend URL is not configured.");
      return;
    }

    axios
      .post(`${backendUrl}/auth/signup`, payload)
      .then((response) => {
        // Handle successful registration
        alert("Registration successful!");
        navigate("/auth");
        console.log("Server response:", response.data);
        // Optionally, redirect or reset form here
      })
      .catch((error) => {
        // Handle errors from the backend
        alert("An error occurred during registration. Please try again.");
        console.error("Registration error:", error);
      });

    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </Label>
        <Input
          id="name"
          type="name"
          placeholder="John doe"
          {...register("name")}
          className="mt-1"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            {...register("password")}
            className="mt-1 pr-10"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5 text-gray-500" />
            ) : (
              <FaEye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            {...register("confirmPassword")}
            className="mt-1 pr-10"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showConfirmPassword ? (
              <FaEyeSlash className="h-5 w-5 text-gray-500" />
            ) : (
              <FaEye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
