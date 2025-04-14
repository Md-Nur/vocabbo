"use client";
import NavLink from "./NavLink";
import { useEffect, useRef } from "react";

const NavDropdown = ({
  name,
  routes,
}: {
  name: string;
  routes: { name: string; url?: string }[];
}) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        detailsRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    const details = document.getElementsByClassName("vocabbo-dropdown");
    if (details) {
      for (let i = 0; i < details.length; i++) {
        if (details[i].id !== `${name}-dropdown`) {
          (details[i] as HTMLDetailsElement).removeAttribute("open");
        }
      }
    }
  };
  return (
    <li className="dropdown dropdown-hover z-30">
      <details
        ref={detailsRef}
        className="vocabbo-dropdown"
        id={`${name}-dropdown`}
        onClick={handleClick}
      >
        <summary className="uppercase">{name}</summary>
        <ul className="p-2 w-56 bg-base-200">
          {routes.map((route, index) => (
            <NavLink key={index} name={route.name} route={route.url} />
          ))}
        </ul>
      </details>
    </li>
  );
};

export default NavDropdown;
