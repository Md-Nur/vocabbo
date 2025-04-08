"use client";
import Input from "@/components/FormUI/input";
import Button from "@/components/FormUI/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { useSignUpContext } from "@/context/SignUpContext";

const SignUp = () => {
  const router = useRouter();
  const { setUserForm } = useSignUpContext();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    password: string;
  }>();

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/auth/exist-email?email=${data.email}`
      );
      if (response.data.exists) {
        toast.error("Email already exists");
        return;
      }
      setUserForm({
        ...data,
        interests: "",
        difficulty: "",
        nativeLanguage: "",
        learningLanguage: "",
      });
      router.push("/auth/signup/2");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <Input
        label="Full Name"
        placeholder="e.g. John Doe"
        type="text"
        {...register("name")}
        errors={errors.name}
      />
      <Input
        label="Email address"
        placeholder="e.g. john.doe@example.com"
        type="email"
        {...register("email")}
        errors={errors.email}
      />
      <Input
        label="Password"
        placeholder="password length must be at least 8 characters"
        type="password"
        {...register("password")}
        errors={errors.password}
      />

      <Button isLoading={isLoading}>Next</Button>
    </form>
  );
};

export default SignUp;
