"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ name, route }: { name: string; route?: string }) => {
  const pathname = usePathname();
  const to = route || `/${name}`;
  // console.log(pathname, to);
  const closeNav = () => {
    const dropdowns = document.getElementsByClassName("vocabbo-dropdown");
    // close dropdown if open
    for (let i = 0; i < dropdowns.length; i++) {
      (dropdowns[i] as HTMLDetailsElement).removeAttribute("open");
    }
    // close nav if open
    
    // remove input checkbox
    const inputNav = document.getElementById("my-drawer-3");
    if (inputNav) {
      (inputNav as HTMLInputElement).checked = false;
    }
  };

  return (
    <li className="list-none" onClick={closeNav}>
      <Link
        className={`${pathname === to ? "font-bold underline" : ""}`}
        href={to}
      >
        {name.toUpperCase()}
      </Link>
    </li>
  );
};

export default NavLink;
