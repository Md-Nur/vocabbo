"use client";

import { SignUpContext, signupSchema } from "@/context/SignUpContext";
import { useState } from "react";
import { z } from "zod";

export const SignUpProvider = ({ children }: { children: React.ReactNode }) => {
  const [userForm, setUserForm] = useState<z.infer<typeof signupSchema> | null>(
    null
  );
  return (
    <SignUpContext.Provider value={{ userForm, setUserForm }}>
      {children}
    </SignUpContext.Provider>
  );
};
