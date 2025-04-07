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
      <NavDropdown
        name="Words"
        routes={[
          { name: "New Word", url: "/new-words" },
          { name: "My Words", url: "/my-words/1" },
          { name: "Word List", url: "/word-list" },
          { name: "Bookmarks", url: "/bookmarks" },
        ]}
      />

      {user?.role === "admin" && (
        <NavDropdown
          name="Admin"
          routes={[{ name: "User Approval", url: "/admin/user-approval" }]}
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
          <NavLink name="signup" route="/auth/signup" />
        </>
      )}
    </>
  );
};

export default NavRoutes;
