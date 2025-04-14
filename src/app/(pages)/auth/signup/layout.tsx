"use client";

import { getPreviousRoute } from "@/lib/utils";
import { SignUpProvider } from "@/providers/SignUpProvider";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function SignUpLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (user?.id) {
      router.push(getPreviousRoute());
    }
  }, [user]);
  return (
    <SignUpProvider>
      <div className="">
        <h1 className="text-3xl md:text-5xl font-bold text-center my-10">
          Join Vocabbo
        </h1>
        <div className="hero-content flex-col lg:flex-row mx-auto">
          <div className="text-center lg:text-left md:min-w-96 min-w-72">
            <Image
              src="/signup.png"
              alt="signup"
              width={500}
              height={500}
              className="w-full h-full object-cover max-w-96"
            />
            <p className="py-6">
              Please enter your details to create an account.
            </p>
          </div>
          <div className="card bg-base-200 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">{children}</div>
            <Link href="/auth/login" className="link link-hover link-secondary px-6 mb-5">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </SignUpProvider>
  );
}
