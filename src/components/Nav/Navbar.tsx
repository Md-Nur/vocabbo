"use client";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import Logout from "./Logout";
import { ReactNode } from "react";
import NavRoutes from "./NavRoutes";
import { IoMdMenu } from "react-icons/io";
export default function Navbar({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full sticky top-0 z-10 shadow-lg">
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
