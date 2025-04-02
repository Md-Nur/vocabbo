"use client";
import { useAppSelector } from "@/store/hooks";
import NavDropdown from "./NavDropdown";
import NavLink from "./NavLink";
import Logout from "./Logout";

const NavRoutes = () => {
  const user = useAppSelector((state) => state.user.user);
  return (
    <>
      <NavLink name="home" route="/" />
      <NavDropdown
        name="Quiz"
        routes={[
          { name: "Start Quiz", url: "/start-quiz" },
          { name: "Quiz Results", url: "/quiz-results" },
        ]}
      />

      {user?.role === "admin" && (
        <NavDropdown
          name="Admin"
          routes={[
            { name: "User Approval", url: "/admin/user-approval" },
            { name: "Content Approval", url: "/admin/content-approval" },
          ]}
        />
      )}

      {user?.id ? (
        <>
          <NavLink name="Dashboard" route="/dashboard" />
          <Logout />
        </>
      ) : (
        <>
          <NavLink name="login" route="/auth/login" />
          <NavLink name="join" route="/join/1" />
        </>
      )}
    </>
  );
};

export default NavRoutes;
