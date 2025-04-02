"use client";
import Input from "@/components/FormUI/input";
import Button from "@/components/FormUI/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { toast } from "sonner";
import Textarea from "@/components/FormUI/textarea";
import Select from "@/components/FormUI/select";
import Link from "next/link";
import { useEffect } from "react";
import { getPreviousRoute } from "@/lib/utils";

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  interests: z.string().min(1),
  difficulty: z.string().min(1),
});

const SignUp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      interests: "",
    },
  });

  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: z.infer<typeof signupSchema>) => {
      const response = await axios.post("/api/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setUser(data));
      toast.success("Account created successfully");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    },
    retry: false,
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    await signupMutation.mutateAsync(data);
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left md:min-w-96 min-w-72">
          <h1 className="text-3xl md:text-5xl font-bold">Join Vocabbo</h1>
          <p className="py-6">
            Please enter your details to create an account.
          </p>
          <Link href="/auth/login" className="link link-hover link-secondary">
            Already have an account? Login
          </Link>
        </div>
        <div className="card bg-base-200 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
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
              <Textarea
                label="Interest"
                placeholder="e.g. English, Gaming, Dancing, etc."
                {...register("interests")}
                errors={errors.interests}
              />
              <Select
                label="Difficulty"
                {...register("difficulty")}
                errors={errors.difficulty}
                options={[
                  { value: "easy" },
                  { value: "medium" },
                  { value: "hard" },
                ]}
              />
              <Button type="submit" disabled={signupMutation.isPending}>
                {signupMutation.isPending ? "Registering..." : "Register"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
