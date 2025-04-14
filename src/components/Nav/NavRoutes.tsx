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
          { name: "Word List", url: "/word-list/1" },
          { name: "Bookmarks", url: "/bookmarks/1" },
        ]}
      />

      {user?.role === "admin" && (
        <NavDropdown
          name="Admin"
          routes={[{ name: "User Approval", url: "/admin/user-approval" }]}
        />
      )}

      <NavLink name="leaderboard" route="/leaderboard" />
      {user?.id ? (
        <>
          <NavLink name="Dashboard" route="/dashboard" />
          <Logout />
        </>
      ) : (
        <>
          <NavLink name="login" route="/auth/login" />
          <NavLink name="signup" route="/auth/signup/1" />
        </>
      )}
    </>
  );
};

export default NavRoutes;
