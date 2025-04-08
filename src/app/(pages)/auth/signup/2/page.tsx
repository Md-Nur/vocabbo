"use client";

import Button from "@/components/FormUI/button";
import Input from "@/components/FormUI/input";
import Select from "@/components/FormUI/select";
import Textarea from "@/components/FormUI/textarea";
import { useSignUpContext } from "@/context/SignUpContext";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignUp2 = () => {
  const dispatch = useAppDispatch();
  const { userForm, setUserForm } = useSignUpContext();
  const router = useRouter();

  useEffect(() => {
    if (!userForm?.name || !userForm?.email || !userForm?.password) {
      toast.error("Please complete the previous page info");
      router.push("/auth/signup/1");
    }
  }, [userForm, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    nativeLanguage: string;
    learningLanguage: string;
    interests: string;
    difficulty: string;
  }>();

  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async () => {
      const response = await axios.post("/api/auth/signup", userForm);
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

  const onSubmit = async (data: {
    nativeLanguage: string;
    learningLanguage: string;
    interests: string;
    difficulty: string;
  }) => {
    if (
      !userForm?.name ||
      !userForm?.email ||
      !userForm?.password ||
      !userForm
    ) {
      toast.error("Please complete the previous page info");
      router.push("/auth/signup/1");
      return;
    }
    setUserForm({
      name: userForm.name,
      email: userForm.email,
      password: userForm.password,
      ...data,
    });
    await signupMutation.mutateAsync();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <Input
        label="Native Language"
        placeholder="e.g. English"
        type="text"
        {...register("nativeLanguage")}
        errors={errors.nativeLanguage}
      />
      <Input
        label="Learning Language"
        placeholder="e.g. Spanish"
        type="text"
        {...register("learningLanguage")}
        errors={errors.learningLanguage}
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
          { label: "Beginner", value: "easy" },
          { label: "Intermediate", value: "medium" },
          { label: "Advanced", value: "hard" },
        ]}
      />
      <Button isLoading={signupMutation.isPending}>Sign Up</Button>
    </form>
  );
};

export default SignUp2;
