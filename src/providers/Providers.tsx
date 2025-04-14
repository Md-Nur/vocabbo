"use client";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import UserProvider from "./User";
import { ReduxProvider } from "./ReduxProvider";
import TanstackProvider from "./Tanstack";
import Navbar from "@/components/Nav/Navbar";
import Footer from "@/components/Footer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <TanstackProvider>
        <UserProvider>
          <Navbar>
            {children}
            <Toaster />
            <Footer />
          </Navbar>
        </UserProvider>
      </TanstackProvider>
    </ReduxProvider>
  );
}
