"use client";
import { useUserAuth } from "@/context/UserAuth";
import axios from "axios";
import Image from "next/image";
import NavLink from "./NavLink";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser } = useUserAuth();
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      if (res.status === 200) {
        setUser(null);
        toast.success("Logged out successfully");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };
  const handleVisible = () => {
    const profile = document.getElementById("profile");
    if (profile.classList.contains("hidden")) {
      profile.classList.remove("hidden");
    } else {
      profile.classList.add("hidden");
    }
  };
  return (
    <div className="dropdown dropdown-end mr-5" onClick={handleVisible}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-14 rounded-full">{user?.name}</div>
      </div>
      <ul
        tabIndex={0}
        id="profile"
        className="menu menu-sm dropdown-content bg-base-200 w-40 rounded-box z-40 mt-3 p-2 shadow"
      >
        <NavLink name={`${user?.name}'s Profile`} route="/dashboard" />
        <NavLink name="Add Blog" route="/add-blog" />
        <NavLink name="Add Event" route="/add-event" />
        <NavLink name="Add Photo" route="/add-img" />
        <li>
          <button onClick={handleLogout}>LOGOUT</button>
        </li>
      </ul>
    </div>
  );
};

export default Profile;
