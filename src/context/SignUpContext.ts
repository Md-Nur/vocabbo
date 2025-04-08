"use client";
import { createContext, useContext } from "react";

import { z } from "zod";
export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  interests: z.string(),
  difficulty: z.string(),
  nativeLanguage: z.string(),
  learningLanguage: z.string(),
});
export const SignUpContext = createContext<{
  userForm: z.infer<typeof signupSchema> | null;
  setUserForm: (userForm: z.infer<typeof signupSchema>) => void;
}>({
  userForm: null,
  setUserForm: () => {},
});

export const useSignUpContext = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUpContext must be used within a SignUpProvider");
  }
  return context;
};
