"use client";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import UserProvider from "./User";
import { ReduxProvider } from "./ReduxProvider";
import TanstackProvider from "./Tanstack";


export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <TanstackProvider>
        <UserProvider>{children}</UserProvider>
        <Toaster />
      </TanstackProvider>
    </ReduxProvider>
  );
}
