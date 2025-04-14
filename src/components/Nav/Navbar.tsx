"use client";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { ReactNode } from "react";
import NavRoutes from "./NavRoutes";
import { IoMdMenu } from "react-icons/io";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ children }: { children?: ReactNode }) {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div
          style={{
            backdropFilter: "blur(1rem)",
          }}
          className="w-full sticky top-0 z-10 shadow-lg"
        >
          <div className="navbar w-full max-w-6xl mx-auto">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <IoMdMenu className="w-7 h-7" />
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">
              <Link href="/" className="text-lg font-bold">
                Vocabbo
              </Link>
            </div>
            <div className="hidden flex-none lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                <NavRoutes />
              </ul>
            </div>
            <ThemeToggle />
          </div>
        </div>
        {children}
      </div>
      <div className="drawer-side z-20">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <NavRoutes />
        </ul>
      </div>
    </div>
  );
}
