"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/FormUI/button";
import Input from "@/components/FormUI/input";
import { getPreviousRoute } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import loginImg from "../../../../../public/login.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

// Don't pass props to the component
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user?.id) {
      router.push(getPreviousRoute());
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/login", data);
      dispatch(setUser(response.data));
      toast.success("Login successful!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <h1 className="text-3xl md:text-5xl font-bold text-center my-10">
        Login
      </h1>
      <div className="hero-content flex-col lg:flex-row mx-auto">
        <div className="text-center lg:text-left md:min-w-96 min-w-72">
          <Image
            alt="login"
            src={loginImg}
            className="w-full h-full object-cover max-w-96"
            placeholder="blur"
          />
          <p className="py-6">Please enter your email and password to login.</p>
        </div>
        <div className="card bg-base-200 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <Input
                label="Email address"
                type="email"
                {...register("email")}
                errors={errors.email}
              />
              <Input
                label="Password"
                type="password"
                {...register("password")}
                errors={errors.password}
              />

              <Button isLoading={isLoading}>Sign in</Button>
              <br />
              <Link
                href="/auth/signup/1"
                className="link link-hover link-secondary"
              >
                Don't have an account? Sign up
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
