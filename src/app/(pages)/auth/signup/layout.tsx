"use client";

import { getPreviousRoute } from "@/lib/utils";
import { SignUpProvider } from "@/providers/SignUpProvider";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
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
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
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
            <div className="card-body">{children}</div>
          </div>
        </div>
      </div>
    </SignUpProvider>
  );
}
